package fil.iagl.appengine.spi;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;

import fil.iagl.appengine.Constants;
import fil.iagl.appengine.domain.Profile;
import fil.iagl.appengine.form.ProfileForm;

@Api(name ="annonce", 
	version="v1", 
	clientIds= {Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
	description= "API pour le tp 'annonce' IAGL 2015")
public class AnnonceApi {

	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	private static String extractNameFromEmail(String email){
		return email == null ? null : email.substring(0, email.indexOf("@"));
	}
	
	private static void CheckUser(User user) throws UnauthorizedException{
		if(user == null){
			throw new UnauthorizedException("Veuillez vous identifier");
		}
	}
	
	
	@ApiMethod(name = "saveProfile", path = "profile", httpMethod = HttpMethod.POST)
	public Profile saveProfile(final User user, ProfileForm profileForm) throws UnauthorizedException{
		CheckUser(user);
		
		String city = profileForm.getCity();
		String name = profileForm.getName();
		String email = user.getEmail();
		String userId = user.getUserId();
		if(name == null){
			name = extractNameFromEmail(email);
		}
		
		Profile profile = new Profile(userId,name,email,city);
		
		//TO DO
		// Save the profile in datastore
		Key profileKey = KeyFactory.createKey("Profile", userId);
		Entity profileStored = new Entity("Profile",profileKey.getName());
		profileStored.setProperty("userId", userId);
		profileStored.setProperty("email", email);
		profileStored.setProperty("name", name);
		profileStored.setProperty("city", city);
		
		datastore.put(profileStored);
		
		return profile;
	}
	
	
	@ApiMethod(name = "getProfile", path="profile", httpMethod = HttpMethod.GET)
	public Profile getProfile(final User user) throws UnauthorizedException{
		CheckUser(user);
		
		Profile profile = null;
		Key profileKey = KeyFactory.createKey("Profile",user.getUserId());
		Entity profileStored;
		try {
			profileStored = datastore.get(profileKey);
			String userId = (String) profileStored.getProperty("userId");
			String email = (String) profileStored.getProperty("email");
			String name = (String) profileStored.getProperty("name");
			String city = (String) profileStored.getProperty("city");
			
			profile = new Profile(userId,email,name,city);
		} catch (EntityNotFoundException e) {
			
			e.printStackTrace();
		}
		

		return profile;
	}
}
