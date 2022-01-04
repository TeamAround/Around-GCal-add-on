

/**
 *  Show homepage UI
 *
 *  @return {ConferenceData}
 */
function startHomepageCard() {
  var version = Settings.get("version");
  console.log("startHomepageCard() v%s", version);
  var up = PropertiesService.getUserProperties();
  var selected_room = up.getProperty('selected_room');
  console.log("selected_room: %s", selected_room);
  var service = AroundApp().getOAuthService();
  // debugging
  /*
  var token = service.getToken();
  console.log("hasAccess: "+ service.hasAccess());
  console.log("isExpired: " + service.isExpired_(token));
  console.log("canRefresh: " + service.canRefresh_(token));
  console.log("granted_time: "+ new Date( parseInt(token.granted_time*1000)));
  */
  // debugging 
  if (service.hasAccess()) {
   return createLogoutCard();
  } else {
   return createLoginCard();
  }
}


/**
 *  Show Update UI
 *  when user wants to edit event with Around conference
 * 
 *  @return {ConferenceData}
 */
function startUpdateCard(parameters) {
  console.log("startUpdateCard()");
  var service = AroundApp().getOAuthService();
  if (service.hasAccess()) {
   return selectMeetingType(parameters); 
  } else {
   return createLoginCard();
  }
}


/**
 *  Show Open UI
 *  when user wants see event detail
 * 
 *  @return {ConferenceData}
 */
function startOpenCard(parameters) {
  console.info("startOpenCard()");
  var service = AroundApp().getOAuthService();
  if (service.hasAccess()) {
   return selectMeetingType(parameters); 
  } else {
   return createLoginCard();
  }
}


/**
 *  Show Login UI
 *  User can login with Around account
 *
 *  @return {Card}
 */
function createLoginCard() {
  console.info("createLoginCard()");
  var service =  AroundApp().getOAuthService();
  var authorizationUrl = service.getAuthorizationUrl();
     
  var topBrandImage = CardService
    .newImage()
    .setImageUrl(Settings.get("topBrandImage"));
  
  var loginImage = CardService
    .newImage()
    .setImageUrl(Settings.get("loginImage"))
    .setOpenLink(CardService
      .newOpenLink()
      .setUrl(authorizationUrl)
      .setOpenAs(CardService.OpenAs.OVERLAY)
      .setOnClose(CardService.OnClose.RELOAD_ADD_ON)); // reload UI when user closes pop-up window

  var bottomBrandImage = CardService
    .newImage()
    .setImageUrl(Settings.get("bottomBrandImage"));
  
  var cardSection = CardService
     .newCardSection()
     .addWidget(topBrandImage)
     .addWidget(loginImage)
     .addWidget(bottomBrandImage)
     
   var card = CardService.newCardBuilder()
    .setName("LOGIN")
    .addSection(cardSection)
    .build();
   return [card];
}

/**
 *  Show Logout UI
 *  User can logout from Around
 *
 *  @return {Card}
 */
function createLogoutCard(){
  console.info("createLogoutCard()");
  var CACHE_DURATION = 6*60*60; // in seconds
  var builder = CardService.newCardBuilder();
  var cache = CacheService.getUserCache();
  var user = cache.get("user_profile");
  if (user === null) {
    user = AroundApp().getUserInfo(); // API
    cache.put("user_profile", JSON.stringify(user), CACHE_DURATION )
    console.info("Save user_profile to UserCache for %s minutes", (CACHE_DURATION/60));
  } else {
    console.info("Load user_profile from UserCache");
    user = JSON.parse(user);
  }
  console.log(user);
  var avatarImage = (user.profilePictureSmall) ? user.profilePictureSmall : Settings.get("defaultAvatarImage");
   builder.setHeader(CardService
        .newCardHeader()
        .setTitle(user.displayName)
        .setSubtitle(user.email)
        .setImageStyle(CardService.ImageStyle.CIRCLE)
        .setImageUrl(avatarImage)
        );
   var space = fillSpace(10); // whitespaces before/after logout button
   builder.addSection(CardService.newCardSection()
        .setCollapsible(false)
        .setNumUncollapsibleWidgets(1)
        .addWidget(CardService.newButtonSet()
            .addButton(CardService.newTextButton()
                .setText(space + 'LOGOUT' + space)
                .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
                .setDisabled(false)
                .setOnClickAction(CardService
                    .newAction()
                    .setFunctionName("logoutUser")))));
    return builder.build();
}

/**
 *  Logout user
 *  
 *  @return {Card}
 */
function logoutUser(){
  console.log("logoutUser()");
  AroundApp().logoutUser();
  return startHomepageCard();
}




/**
 *  Show list of meeting rooms UI
 *  
 *  @return {Card}
 */
function selectMeetingType(par) {
  console.log("selectMeetingType()");
  //console.log(JSON.stringify(par));
  var up = PropertiesService.getUserProperties();
  up.setProperty('akt_event_id',par.calendar.id);
  up.setProperty('calendar_id',par.calendar.calendarId);

  var card_header = CardService.newCardHeader()
      .setTitle('Select meeting type:')
      .setSubtitle('(Pick a room for recurring meetings)');
      
  var builder = CardService.newCardBuilder()
      .setHeader(card_header);
  
  var size = 20; // number of empty spaces before/after text
  // text button according to state
  var add_or_edit_text = par.calendar.conferenceData == undefined ? "SAVE MEETING" : "CHANGE MEETING";
  var button_text = fillSpace(size) + add_or_edit_text + fillSpace(size);
  // button is disabled when add on is in view mode
  var disabled = par.calendar.capabilities.canSetConferenceData ? false : true; 
  var but_addMeeting = CardService.newTextButton()
        .setText(button_text)
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setDisabled(disabled)
        .setOnClickAction(CardService.newAction()
          .setFunctionName("addMeeting"));

    // widget for meeting selection
    var selectionInput = CardService.newSelectionInput()
          .setFieldName('meeting_type')
          .setType(CardService.SelectionInputType.RADIO_BUTTON)
          .setOnChangeAction(CardService.newAction()
            .setFunctionName("changeMeetingType")); // run when user change meeting
   renderUserRooms(selectionInput); // add meetings room into selectbox
    
   var cardsection = CardService.newCardSection() 
      .addWidget(selectionInput)
      .addWidget(but_addMeeting)
      
    builder
      .addSection(cardsection);
      
    /* 
    // code for creating a new room - IT HAS NOT BEEN IMPLEMENTED YET
    var cardsection_new = CardService.newCardSection().setHeader('Or create new room')
    var new_room_name = CardService.newTextInput()
            .setFieldName('new_room_name')
            .setTitle('New room name');
    cardsection_new.addWidget(new_room_name);
    var but_create_room = CardService.newButtonSet()
            .addButton(CardService.newTextButton()
            .setText('Create')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            //.setDisabled(true)
            .setOnClickAction(CardService.newAction().setFunctionName("createNewRoom")));
    cardsection_new.addWidget(but_create_room);
    builder.addSection(cardsection_new);
    */
    return builder.build();
}


/**
 *  Add Around Meeting into Calendar Event from Add-on sidebar
 *  
 *  @return {ConferenceData}
 */
function addMeeting() {
 console.info("addMeeting()");
 try {
   var conferenceData = createAroundConferenceSolution(); 
   //console.log(conferenceData);
   var response = CardService.newCalendarEventActionResponseBuilder()
     .setConferenceData(conferenceData)
     .build();
 } catch(err) {
   console.warn("Error during creating ConferenceSolution from Add-on sidebar UI")
   console.error(err);
   return response;
 }
 return response;
}



/**
 *  Render list of meeting rooms into Add-on sidebar UI
 *  https://developers.google.com/apps-script/reference/card-service/selection-input
 *  @param selectionInput {CardService.SelectionInput}
 *  @return void
 */
function renderUserRooms(selectionInput){
   var isSelected;
   var up = PropertiesService.getUserProperties();
   var selected_room = up.getProperty('selected_room'); // Get selected meetingRoom.key from UI
   var rooms = AroundApp().getMeetings(); // Get list of meeting rooms from Around API
   //console.log(rooms);
   if (rooms.error === "API") throw new Error("There is an isssue with Around API (Meetings endpoint)");
   var cache = CacheService.getScriptCache();
   cache.put("my_rooms", JSON.stringify(rooms), 60*60); // Save data into 1 hour cache
   rooms.unshift({title: "One-off meeting", key: "random_id"});
   for (var i = 0; i < rooms.length; i++) {
     isSelected = (selected_room == rooms[i].key) ? true : false;
     selectionInput.addItem(rooms[i].title, rooms[i].key, isSelected);
   }
}

/**
 *  Save selected room from Add-on sidebar UI
 *  
 */
function changeMeetingType(parameters){
  //console.log('changeMeetingType(): ' + parameters.formInputs.meeting_type);
  var up = PropertiesService.getUserProperties()
  up.setProperty('selected_room', String(parameters.formInputs.meeting_type));
}

/**
 *  Save eventId and calendarId into User Properties
 * 
 *  @return void
 */
function saveEventProperty(par){
  var up = PropertiesService.getUserProperties();
  up.setProperty('akt_event_id',par.calendar.id);
  up.setProperty('calendar_id',par.calendar.calendarId);
}

/**
 *  Create a new pernament meeting room
 *  IT HAS NOT BEEN IMPLEMENTED YET
 *  @return {array} rooms
 */
/*
function createNewRoom(par){
  console.log('new_room_name = ' + par.formInput.new_room_name)
  var rooms = getUserRooms();
  var room_name = par.formInput.new_room_name;
  var room_id = rooms.length + 1;
  rooms.push({name: room_name, id: room_id});
  var up = PropertiesService.getUserProperties();
  up.setProperty('selected_room', room_id);
  up.setProperty('user_rooms', JSON.stringify(rooms));
  return selectMeetingType();//znovu vygeneruju sidebar
}
*/


/**
 *  Get list of meeting rooms from User Properties
 *  IT HAS NOT BEEN IMPLEMENTED YET
 *  @return {array} rooms
 */
/*
function getUserRooms(){
  var up = PropertiesService.getUserProperties();
  var rooms = up.getProperty('user_rooms');
  if(rooms == null){
    return [];
  }else{
    return JSON.parse(rooms);
  }
}
*/