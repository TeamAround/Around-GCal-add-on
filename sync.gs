/**
 *  Initializes syncing of conference data by creating a sync trigger and
 *  sync token if either does not exist yet.
 *
 *  @param {String} calendarId The ID of the Google Calendar.
 */
function initializeSyncing(calendarId) {
  console.info("initializeSyncing()");
  console.log("calendarId: %s", calendarId);
  createSyncTrigger(calendarId);   // Create a syncing trigger if it doesn't exist yet.
  triggerAroundSyncEvents({'calendarId': calendarId}); // Perform an event sync to create the initial sync token
}


/**
 *  Creates a sync trigger if it does not exist yet.
 *
 *  @param {String} calendarId The ID of the Google Calendar.
 */
function createSyncTrigger(calendarId) {
  console.info("createSyncTrigger()");
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    if (trigger.getTriggerSourceId() == calendarId) {  
      console.log("Trigger has been already created")
      return; 
    }
  }
  // Trigger does not exist, so create it
  var trigger = ScriptApp.newTrigger('triggerAroundSyncEvents')
      .forUserCalendar(calendarId)
      .onEventUpdated()
      .create();
  console.log("New trigger was created");
}

/**
 *  Performs sync data 
 *  https://developers.google.com/apps-script/guides/triggers/events#google_calendar_events
 *  @param {String} e Calendar event object
 */
function triggerAroundSyncEvents(e) {
  console.info("triggerAroundSyncEvents()");
  var calendarId = e.calendarId;
  console.log("calendarId: %s", calendarId);
  var properties = PropertiesService.getUserProperties();
  var syncToken = properties.getProperty('syncToken');

  if (syncToken) {
    console.log("Partial Calendar sync (syncToken: %s)", syncToken);
    var options = { syncToken: syncToken }; // Get events since last synchronization
  } else {
    console.log("Full Calendar sync");
    var now = new Date(); 
    var yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    var options = {
      timeMin: now.toISOString(),          // event is starting from now
      updatedMin: yesterday.toISOString(), // events 
      maxResults: 50,   // Max. number of results per page of responses
      orderBy: "updated"
    }
  }

  var events;
  var pageToken;
  do {
    try {
      options.pageToken = pageToken;
      events = Calendar.Events.list(calendarId, options);
    } catch (err) {
      console.log("try/catch error: `%s`", err.message);
      // API call to calendar.events.list failed with error: Sync token is no longer valid, a full sync is required
      if (err.message.indexOf("Sync token is no longer valid") > -1 ) {
        properties.deleteProperty('syncToken');
        console.log("Delete `syncToken` from UserProperties")
        createSyncTrigger(e);
        return;
      } else {
        //console.error(err.message)
        //throw new Error(err.message);
        return
      }
    }

    if (events.items && events.items.length > 0) {
      console.log("Found: %s Calendar events", events.items.length);
      for (var i = 0; i < events.items.length; i++) {
         var calendarEvent = JSON.parse(events.items[i]);
         // {kind=calendar#event, etag="3222090", id=757n03t05, status=cancelled}
         // status = {confirmed, canceled, tentative, cancelled}
         if (calendarEvent.status === "cancelled") {
          calendarEvent = Calendar.Events.get(calendarId,calendarEvent.id);
         }
         console.log(calendarEvent);
         if (isAroundEvent(calendarEvent)) updateConference(calendarEvent);
         //console.log("-----")
      }
    } else {
      console.log("No events were found");
    }

    pageToken = events.nextPageToken;
  } while (pageToken);
  if (events.nextSyncToken) properties.setProperty('syncToken', events.nextSyncToken); // Save sync token
}


/**
 *  Returns true if Calendar event has an Around conference
 *
 *  @param {Object} calendarEvent The Google Calendar event object, as defined by the Calendar API.
 *  @return {boolean}
 */
function isAroundEvent(calendarEvent) {
  if (calendarEvent.conferenceData && calendarEvent.conferenceData.conferenceSolution && calendarEvent.conferenceData.conferenceSolution.name === Settings.get("conferenceSolutionName")) return true;
  return false;
}


/**
 *  Update a conference based on new Google Calendar event information.
 *  The exact implementation of this function is highly dependant on the
 *  details of the third-party conferencing system, so only a rough outline
 *  is shown here.
 *
 *  @param {Object} calendarEvent The Google Calendar event object
 */
function updateConference(calendarEvent) {
  console.log("updateConference()")
  //console.log(JSON.stringify(calendarEvent));

  var addonVersion = calendarEvent.conferenceData.parameters.addOnParameters.parameters.addonVersion || null;
  var aroundRoomId = calendarEvent.conferenceData.parameters.addOnParameters.parameters.aroundRoomId || null;
  var aroundRoomKey = calendarEvent.conferenceData.parameters.addOnParameters.parameters.aroundRoomKey || null;

  //console.log("addonVersion: %s", addonVersion);
  //console.log("aroundRoomId: %s", aroundRoomId);
  //console.log("aroundRoomKey: %s", aroundRoomKey);

  if (calendarEvent.status === "cancelled") {
    console.info("CalendarEvents.status: cancelled");
    if (aroundRoomId !== null && aroundRoomKey !== null) {
      //console.info("Call Around API deleteEvent");
      //var res = AroundApp().deleteMeeting(aroundRoomId, aroundRoomKey);
      //console.log(res)
    }
  } else {
    // for other events
  }
}





