/*
Summary
=======
Apps Script runtime: Rhino (no ES6 features)
IMPORTANT! Let file "info.gs" as a first in list of Files ("info.gs" file define STAGE and PRODUCTION environment)

Settings
=========
STAGE deployment ID: AKfycbzg1hAHIUbDNU6ZcG7H9TUD9x7sov1qsvcLa3UALHdH0hUJjnMFvbu5
(DEPRECATED STAGE deployment ID: AKfycbxIYCTOC8Ff47T74LDGFrLZ9ZMylD6OZum1ZH_23x3BYDeLpNVq0D8dEhahYmIeHjgO
GCP: https://console.cloud.google.com/home/dashboard?project=around-calendar-addon-stage


PRODUCTION deployment ID: AKfycbyQuYo56P_79_2OZ97pGL2QnEL3Efu9QYJsgJu4BwIBn1aKXWfo2qPV1A
GCP: https://console.cloud.google.com/home/dashboard?project=around-calendar-addon-prod 


Preparation for deployment (for STAGE and PRODUCTION Google Account)
=================================
0. Use a new Google Apps Script IDE script.google.com
1. Download Chrome Extension https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=en
2. Login to to your Github account in Chrome extension Google Apps Script github
3. There is a new buttons in IDE menu (Select repository, push/pull)
4. Click on settings (gear icon)
- Sync type: gs 
- Ignore: info.gs
- Don't Manage manifest file (let it unchecked)



Deployment
===============================
0) Login as stage@around.co Google user
1) Develop a new feature or fix a bug
2) Apps Script IDE: Click at button Deploy and choose Test deployments, select Test latest code and click to button Install
3) Calendar Add-on is locally installed for logged-in user. Visit calendar.google.com and test it
4) Push to github


Deploy to STAGE for internal testing (only domain around.com)
5) Apps Script IDE: Click at [Deploy] button (top-right) and choose [Manage deployments]
6) Select type the latest active deployment from left-side, click pencil button (edit)
7) From Version selectbox click New version and write short description and click at [Deploy] button
8) There is a deployment ID (which is still same, for all future deployment).
You can double-check, that is connect with Google Workspace Marketplace listing
https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=around-calendar-addon-stage
No updates are needed in Marketplace SDK
9) Now users in domain can test a new version


Deploy to PRODUCTION
10) Login developer@around.co
11) Pull code from Github (browser will be reloaded)
12) Check order of files in Files list (info.gs must be first, Settings.gs second)
13) Apps Script IDE: Click at [Deploy] button (top-right) and choose [Manage deployments]
14) From Version selectbox click New version and write short description and click at [Deploy] button
15) There is a deployment ID (which is still same, for all future deployment).
You can double-check, that is connect with Google Workspace Marketplace listing
https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleapps_sdk?project=around-calendar-addon-prod

*/