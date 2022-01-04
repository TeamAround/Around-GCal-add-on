/**
 *  Creates a conference, then builds and returns a ConferenceData object
 *  with the corresponding conference information
 *
 *  @param {Object} parameters Carries information about the Google Calendar event.
 *  @return {ConferenceData}
 */
function createAroundConferenceSolution(parameters) {
  try {
    var mode = ""; // {inline, sidebar}
    var calendarId; // Google Calendar ID
    var eventId; // Google Calendar Event ID
    var aroundRoomId;
    var aroundRoomKey; 
    var aroundRoomUrl; // Around Meeting URL
    var aroundRoomPincode; // Around Meeting pincode
    var aroundRoomType; // {random, pernament}
    var eSourceParam; // source param for URL 

    var conferenceError = ConferenceDataService.newConferenceError();
    var dataBuilder = ConferenceDataService.newConferenceDataBuilder();
    var addonVersion = [ENVIRONMENT, Settings.get("version")].join("_");
    console.log("createAroundConferenceSolution() version: " + addonVersion);

    if (parameters) { // inline mode (run directly from "Add conferencing" button from Event)
      console.log("mode: inline");
      mode = "inline";
      console.log(parameters);
      var eventData = parameters.eventData;
      calendarId = eventData.calendarId; // The ID of Calendar, e.g. dev@appsatori.eu
      eventId = eventData.eventId; // e.g. eventID, e.g. 2ui2kkhaetho7iu97t45m7qh20
      try {
        var random_meeting = AroundApp().createMeeting(); // Create random meeting
        aroundRoomType = "random";
      } catch (e) {
        console.log(e.message);
        var service = AroundApp().getOAuthService();
        var authorizationUrl = service.getAuthorizationUrl();
        dataBuilder.setError(conferenceError
                            .setConferenceErrorType(ConferenceDataService.ConferenceErrorType.AUTHENTICATION)
                            .setAuthenticationUrl(authorizationUrl));
        return dataBuilder.build();
      }

      if (random_meeting.error === "AUTH") {
          console.info("Show ConferenceErrorUI (Auth)");
          var service = AroundApp().getOAuthService();
          var authorizationUrl = service.getAuthorizationUrl();
          dataBuilder.setError(conferenceError
                              .setConferenceErrorType(ConferenceDataService.ConferenceErrorType.AUTHENTICATION)
                              .setAuthenticationUrl(authorizationUrl));
          return dataBuilder.build();
      } else if (random_meeting.error === "API") {
          console.info("Show ConferenceErrorUI (Other)");
          dataBuilder.setError(conferenceError
                              .setConferenceErrorType(ConferenceDataService.ConferenceErrorType.PERMISSION_DENIED));
          return dataBuilder.build();
      }
      console.info(random_meeting);
      aroundRoomId = random_meeting.id;
      aroundRoomKey = random_meeting.key;
      aroundRoomUrl = random_meeting.url
    } else { // run from Add on sidepanel
      console.info("mode: sidebar");
      mode = "sidebar";
      var userProperties = PropertiesService.getUserProperties();
      calendarId = userProperties.getProperty('calendar_id'); // e.g stage@around.co
      eventId = userProperties.getProperty('akt_event_id'); // e.g. 2ui2kkhaetho7iu97t45m7qh20
      var cache = CacheService.getScriptCache();
      console.log(cache.get("my_rooms"))
      var meetings = JSON.parse(cache.get("my_rooms")); // get list cached meetings rooms
      var room = userProperties.getProperty('selected_room'); // get meetingRoom.key of selected room
      //console.log('selected_room = ' + room);
      if (room != null && room != 'random_id') { // user selected pernament room
        for (var i = 0; i < meetings.length; i++){
           //console.log('i = ' + i + ' rooms[i].id = ' + rooms[i].id + ' room = ' + room);
           if(meetings[i].key == String(room)){
             console.log(meetings[i]);
             aroundRoomKey = meetings[i].key;
             aroundRoomId = meetings[i].id;
             aroundRoomUrl = meetings[i].url;
             if (meetings[i].pin) aroundRoomPincode = meetings[i].pin; // (optional) pincode from Around API
             if (meetings[i].esource) eSourceParam = meetings[i].esource; // (optional)
             aroundRoomType = "pernament";
           }
        } // meeting iteration
      } else { 
        //user selected room with random link from Add-onUI
        var random_meeting = AroundApp().createMeeting(); // create new meeting room with random link
        aroundRoomType = "random";
        console.log(random_meeting)
        aroundRoomId = random_meeting.id;
        aroundRoomKey = random_meeting.key;
        aroundRoomUrl = random_meeting.url;
        // no pincode or esource
      }
    }


    // permanent_room_added za meeting_link_changed
    // random_link_generated za event created
    // TODO
    /*
    try {
      var calendarEvent = Calendar.Events.get(calendarId,eventId);
      if (isAroundEvent(calendarEvent)) {
        AroundApp().hitAnalytics("meeting_link_changed");
        console.log("event: meeting_link_changed")
      } else {
        AroundApp().hitAnalytics("event_created");
        console.log("event: event_created")
      }
    } catch (e) {
      // The calendar event does not exist yet;
      AroundApp().hitAnalytics("event_created");
      console.log("event: event_created")
    }
    */
    if (aroundRoomType === "random") {
      AroundApp().hitAnalytics("random_link_generated");
    } else if (aroundRoomType === "pernament") {
      AroundApp().hitAnalytics("permanent_room_added");
    } else {
      AroundApp().hitAnalytics("unknown_event");
    }

    var videoEntryPoint = ConferenceDataService
                              .newEntryPoint()
                              .setEntryPointType(ConferenceDataService.EntryPointType.VIDEO)
                              .setUri(aroundRoomUrl);

    if (aroundRoomPincode && aroundRoomPincode !== null) {
      videoEntryPoint.setPin(aroundRoomPincode);
      console.log("aroundRoomPincode: %s", aroundRoomPincode);
      //var queryChar = "&";
    } else {
      //var queryChar = "?";
    }

    videoEntryPoint.setMeetingCode(aroundRoomKey);
    /*
    if (eSourceParam && eSourceParam !== null) {
      aroundRoomUrl += queryChar + "esource="+ eSourceParam;
    }
    */
    
    console.log("calendarId: %s", calendarId);
    //console.log("aroundRoomId: %s", aroundRoomId);   
    //console.log("aroundRoomKey: %s", aroundRoomKey);
    console.log("aroundRoomUrl: %s", aroundRoomUrl);


    dataBuilder.addEntryPoint(videoEntryPoint);

    /*
    dataBuilder.addEntryPoint(ConferenceDataService
                              .newEntryPoint()
                              .setEntryPointType(ConferenceDataService.EntryPointType.MORE)
                              .setUri(Settings.get("joiningInstructions")));
    */

    dataBuilder.addConferenceParameter(ConferenceDataService.newConferenceParameter()
                                       .setKey("addonVersion")
                                       .setValue(addonVersion));

    dataBuilder.addConferenceParameter(ConferenceDataService.newConferenceParameter()
                                       .setKey("aroundRoomKey")
                                       .setValue(aroundRoomKey));

    dataBuilder.addConferenceParameter(ConferenceDataService.newConferenceParameter()
                                       .setKey("aroundRoomId")
                                       .setValue(aroundRoomId));

    var conferenceSolutionId = "around";
    dataBuilder.setConferenceSolutionId(conferenceSolutionId); // mandatory when Add-on is called from sidebar
    dataBuilder.setConferenceId(aroundRoomKey);
    //dataBuilder.setNotes( [aroundRoomUrl, "", Settings.get("conferenceDataNotes")].join("<br/>"));
    dataBuilder.setNotes(aroundRoomUrl);
    try {
      initializeSyncing(calendarId); // Sync data between Google Calendar and Around API
    } catch (e) {
      console.error("initializeSyncing:" + e.message)
    }
  } catch(err) {
    console.error(err);
    dataBuilder.setError(conferenceError.setConferenceErrorType(ConferenceDataService.ConferenceErrorType.TEMPORARY));
 }
 return dataBuilder.build();
}


