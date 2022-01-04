
/**
 *  Integration to Around API
 *  
 *
 *  @param {Object} calendarEvent The Google Calendar event object
 */
var AroundApp = ( function() {
  var obj = {};
  
  obj.logoutUser = function() {
    console.info("AroundApp.logoutUser()")
    obj.revokeAccess();
    var cache = CacheService.getUserCache();
    cache.remove("user_profile"); // delete user info from Cache
    var up = PropertiesService.getUserProperties();
    up.deleteProperty("selected_room"); // delete selecte room from Properties
    obj.getOAuthService().reset(); // revoke access to Around API
  }
  
  obj.revokeAccess = function() {
    console.log("AroundApp.revokeAccess()");
    var url =  obj.getUrl("api") + "api/v1/ext/logout";
    var data = obj.makeRequest("post", url);
    return data;
  }

  obj.makeRequest = function(method, url, body) {
    console.log("AroundApp.makeRequest()");
    var service =  obj.getOAuthService();
 
    if (!service.hasAccess()) {
      console.log("Add-on don't hasAccess");
      console.log("Token: "+ JSON.stringify(service.getToken()));
      return { error: "AUTH", message: "Authorize to Around" }
    }
    var options = {
        method: method,
        contentType: "application/json",
        headers: {
          Authorization: 'Bearer ' + service.getAccessToken()
        },
        muteHttpExceptions: true // prevents thrown HTTP exceptions
     }
     if (method === "post" && body != null) {
       options.payload = JSON.stringify(body);
       console.log(options.payload);
     }
     console.log(method.toUpperCase() +" "+ url);
     var response = UrlFetchApp.fetch(url, options);
     var responseCode = response.getResponseCode();
     var json = JSON.parse(response.getContentText());
     
     if (responseCode < 200 || 300 < responseCode) {
      console.warn(json);
      return { error: "API", message: "Response code from API: " + responseCode };
     } else if (json.statusCode == 200) {
      console.log(json);
      return json.data;
     } else {
      console.error(json)
      return { error: "API", message: json.message };
     }
  };
  
  obj.testAPI = function() {
    var url =  AroundApp().getUrl("api") + "api/v1/ext/auth/test";
    var data = obj.makeRequest("post", url);
    return data;
  }
  
  /*
      {
      "statusCode": 200,
      "message": "OK",
      "data": [
        {
          "id": "0e355baa-a1fe-46dd-a384-f565e685e549",
          "title": "Beda's personal room",
          "key": "brb",
          "url": "https://meet.around.dev:3000/r/brb"
        },
        {
          "id": "c23e7df2-1640-4861-a11d-07cfe405896d",
          "title": "Around meet",
          "key": "llnwdqhl",
          "url": "https://meet.around.dev:3000/r/llnwdqhl"
        }
      ]
    } 
  */
  obj.getMeetings = function() {
    console.log("AroundApp.getMeetings()");
    var url =  obj.getUrl("api") + "api/v1/ext/room/list";
    var data = obj.makeRequest("post", url, { roomType: [0] });
    return data;
  }
  
   /*
    {
      "statusCode": 200,
      "message": "OK",
      "data": {
        "id": "c6fac192-2733-46aa-a26e-0de634e348c4",
        "title": "Around meet",
        "key": "fhden6r9",
        "url": "https://meet.around.dev:3000/r/fhden6r9"
      }
    }
  */
  obj.createMeeting = function() {
    console.info("AroundApp.createMeeting()");
    var url =  obj.getUrl("api") + "api/v1/ext/room/new";
    var data = obj.makeRequest("post", url, { roomType: 3 });
    return data;
  }
  /*
    Deletes meeting from Around
  */
  obj.deleteMeeting = function(aroundRoomId, aroundRoomKey) {
    console.info("AroundApp.deleteMeeting()");
    var url =  obj.getUrl("api") + "api/v1/ext/room/remove";
    var data = obj.makeRequest("post", url, { id: aroundRoomId, key: aroundRoomKey });
    return data;
  }

  /*
    Analytics endpoint
    eventName = { event_created || meeting_link_changed }
  */
  obj.hitAnalytics = function(eventName) {
    console.info("AroundApp.hitAnalytics("+eventName+")");
    var url =  obj.getUrl("api") + "api/v1/ext/analytics";
    var data = obj.makeRequest("post", url, { event: eventName });
    return data;
  }

  /*
   {
    "statusCode": 200,
    "message": "OK",
    "data": {
      "email": "beda@around.xyz",
      "firstName": "Bedrich",
      "lastName": "Michalek",
      "displayName": "Beda",
      "profilePictureSmall": "https://api.around.dev:3000/api/v1/public/dev-profile-photo/ac17236d-9afe-4ce8-9997-b16fc1f096d9_91164109-22ca-412f-bc19-daa99a226b11_s.jpg"
    }
  }
  */ 
  obj.getUserInfo = function() {
    console.log("AroundApp.getUserInfo()");
    var url =  obj.getUrl("api") + "api/v1/ext/user/profile";
    var data = obj.makeRequest("get", url)
    return data;
  }
  

  
  /*
    @param mode web nebo web
  */
  obj.getUrl = function(urlType) {
    var domain = Settings.get("domain");
    var subdomain
   
    if (urlType === "app") {
      subdomain = "app";
    } else if (urlType === "api") {
      subdomain = "api";
    } else if (urlType === "meet") {
      subdomain = "meet";
    } else {
      throw new Error("URL type isn't meet / app / api");
    }
    return ["https://", subdomain,".", "around", ".", domain, "/"].join("");
  }
  
  
  /**
   * Configures the OAuth Around service
  */
  obj.getOAuthService = function() {
    var log = false;
    var serviceName = ["around", ENVIRONMENT].join("_");
    if (log) console.log(serviceName);
    var authorizationBaseUrl = AroundApp().getUrl("app") + "oauth/authorize"; // https://app.around.video/oauth/authorize
    if (log) console.log("authorizationBaseUrl:" + authorizationBaseUrl);
    var tokenUrl = AroundApp().getUrl("api") + "api/v1/public/oauth/access"; // https://api.around.video/api/v1/public/oauth/access 
    if (log) console.log("tokenUrl: "+ tokenUrl);
    var clientId = Settings.get("clientId");
    if (log) console.log("clientId:" + clientId);
    var clientSecret = Settings.get("clientSecret");
    if (log) console.log("clientSecret:" + clientSecret);
    // OAuth2 is external Google library https://github.com/googleworkspace/apps-script-oauth2
    // OAuth2Dev is forked OAuth library for inspections
    return OAuth2.createService(serviceName)
        .setAuthorizationBaseUrl(authorizationBaseUrl)
        .setTokenUrl(tokenUrl)
        .setClientId(clientId)
        .setClientSecret(clientSecret)
        .setCallbackFunction('authCallback')
        .setPropertyStore(PropertiesService.getUserProperties())
        .setScope('meet.later:write,meet.permanent:read,user.profile:read')
  }

  return obj;
});




/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  console.log("OAuth.authCallback()");
  console.log(request);
  var service =  AroundApp().getOAuthService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    var app = HtmlService.createTemplateFromFile("view-usercallback");
    app.postInstallationImage = Settings.get("postInstallationImage");
    return app.evaluate()
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}
