
/**
 * @fileoverview
 * Provides methods for the annonce Endpoints sample UI and interaction with the
 * annonce Endpoints API.
 *
 * @author danielholevoet@google.com (Dan Holevoet)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** fil namespace for Google Developer Relations projects. */
google.fil = google.fil || {};

/** appengine namespace for fil sample code. */
google.fil.appengine = google.fil.appengine || {};

/** annonce namespace for this sample. */
google.fil.appengine.annonce = google.fil.appengine.annonce || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
google.fil.appengine.annonce.CLIENT_ID = 
    '368602197734-20d5cmpco2ci41matdrarqfpufv9q7gl.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
google.fil.appengine.annonce.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.fil.appengine.annonce.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
google.fil.appengine.annonce.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      google.fil.appengine.annonce.signedIn = true;
      document.getElementById('signinButton').innerHTML = 'Sign out';
      document.getElementById('authedGreeting').disabled = false;
      
      // si pas de profile, on en crée un par defaut et le recupere.
      try{
          google.fil.appengine.annonce.getProfile();
      }
      catch(err){
          google.fil.appengine.annonce.saveProfile();
          google.fil.appengine.annonce.getProfile();
      }
    }
  });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
google.fil.appengine.annonce.signin = function(mode, callback) {
  gapi.auth.authorize({client_id : google.fil.appengine.annonce.CLIENT_ID,
				       scope     : google.fil.appengine.annonce.SCOPES, 
				       immediate : mode},
				      callback);
};

/**
 * Presents the user with the authorization popup.
 */
google.fil.appengine.annonce.auth = function() {
  if (!google.fil.appengine.annonce.signedIn) {
    google.fil.appengine.annonce.signin(false, google.fil.appengine.annonce.userAuthed);
  } else {
    google.fil.appengine.annonce.signedIn = false;
    document.getElementById('signinButton').innerHTML = 'Sign in';
    document.getElementById('authedGreeting').disabled = true;
  }
};

/**
 * Prints a greeting to the greeting log.
 * param {Object} greeting Greeting to print.
 */
google.fil.appengine.annonce.print = function(greeting) {
  var element = document.createElement('div');
  element.classList.add('row');
  element.innerHTML = greeting.message;
  document.getElementById('outputLog').appendChild(element);
};


/*
 * */
google.fil.appengine.annonce.saveProfile = function(name, city) {
gapi.client.annonce.greetings.saveProfile({'name' : name, 'city' : city}).execute(
  function(resp) {
    if (!resp.code) {
      google.fil.appengine.annonce.print(resp);
    } else {
      window.alert(resp.message);
    }
  });
};

/**
 * Gets a numbered greeting via the API.
 * @param {string} id ID of the greeting.
 */
google.fil.appengine.annonce.getProfile = function() {
  gapi.client.annonce.getProfile().execute(
      function(resp) {
        if (!resp.code) {
          google.fil.appengine.annonce.print(resp);
          // TO DO REMPLIR PROFILE (genre une fonction remplir profile(resp);
          console.log(resp);
          console.log(resp.email);
          console.log(resp.city);
          document.getElementById("name").value = resp.name;
          document.getElementById("city").value = resp.city;
        } else {
        	throw "Pas de profile";
        }
      });
};
//google.fil.appengine.annonce.getGreeting = function(id) {
//  gapi.client.annonce.greetings.getGreeting({'id': id}).execute(
//      function(resp) {
//        if (!resp.code) {
//          google.fil.appengine.annonce.print(resp);
//        } else {
//          window.alert(resp.message);
//        }
//      });
//};

/**
 * Lists greetings via the API.
 */
google.fil.appengine.annonce.listAnnonce = function() {
  gapi.client.annonce.getAnnonces().execute(
      function(resp) {
        if (!resp.code) {
          resp.items = resp.items || [];
          for (var i = 0; i < resp.items.length; i++) {
            google.fil.appengine.annonce.print(resp.items[i]);
            //TO DO DISPLAY ANNONCES
            console.log(resp.items[i]);
          }
        }
      });
};

/**
 * Gets a greeting a specified number of times.
 * @param {string} greeting Greeting to repeat.
 * @param {string} count Number of times to repeat it.
 */
google.fil.appengine.annonce.multiplyGreeting = function(
    greeting, times) {
  gapi.client.annonce.greetings.multiply({
      'message': greeting,
      'times': times
    }).execute(function(resp) {
      if (!resp.code) {
        google.fil.appengine.annonce.print(resp);
      }
    });
};

/**
 * Greets the current user via the API.
 */
google.fil.appengine.annonce.authedGreeting = function(id) {
  gapi.client.annonce.greetings.authed().execute(
      function(resp) {
        google.fil.appengine.annonce.print(resp);
      });
};

/**
 * Enables the button callbacks in the UI.
 */
google.fil.appengine.annonce.enableButtons = function() {
  document.getElementById('getGreeting').onclick = function() {
    google.fil.appengine.annonce.getGreeting(
        document.getElementById('id').value);
  }

  document.getElementById('listGreeting').onclick = function() {
    google.fil.appengine.annonce.listGreeting();
  }

  document.getElementById('multiplyGreetings').onclick = function() {
    google.fil.appengine.annonce.multiplyGreeting(
        document.getElementById('greeting').value,
        document.getElementById('count').value);
  }

  document.getElementById('authedGreeting').onclick = function() {
    google.fil.appengine.annonce.authedGreeting();
  }
  
  document.getElementById('signinButton').onclick = function() {
    google.fil.appengine.annonce.auth();
  }
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
google.fil.appengine.annonce.init = function(apiRoot) {
  // Loads the OAuth and annonce APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      google.fil.appengine.annonce.enableButtons();
      google.fil.appengine.annonce.listAnnonce();
      google.fil.appengine.annonce.signin(true,google.fil.appengine.annonce.userAuthed);
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('annonce', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};
