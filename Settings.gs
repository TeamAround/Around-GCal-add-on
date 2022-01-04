
/*
 Settings for Dev, Stage and Production
*/
var Settings = ( function(environment) {
  var obj =  {};
  var _ = {};
  
  _["STAGE"] = {
    domain : "video",
    conferenceSolutionName: "Around Meeting",
    clientId: "wiabnwbabqelgh559q1w80uci4kvspgp.around.co",
    clientSecret: "3cypoienbw6bf7yapcw97e6sm7skjy9x",
    conferenceDataNotes: "To change this link from a one-off meeting to a recurring room, open our add-on (on the right-hand side) and pick the specific room from there..",
    joiningInstructions: "https://docs.google.com/document/d/16So-Va17ShrIgrP47aMH1id_6yT87YpabqcH_2qQOOI/edit",
    version: 27,
    // images
    defaultAvatarImage: "https://lh3.googleusercontent.com/pw/ACtC-3etFqL-a3goAYheEBcYTcacKRhn9EDkvOBWBrP0IWtr1xawdVB002DobBAoXEpkX4kg3HR8Aac84xMBSQdtvzEBYHSFu6WmiCUxt7Twut6PBT7EP-UHBHQSkN1ZFEsA5zI9ZDW8m_4PRbrLNzemm5LA=s96-no",
    topBrandImage: "https://lh3.googleusercontent.com/pw/ACtC-3e6vkdaFOedWubvYUdN2Ajh1DRgqmacW7OIpslJxItU7Pur-7ugywB0rMY3wJMd--lYuK75N6oJoCFu05oHBxaFOhgWttm7UEFBgSPOBhRbxGEvh8gyfdAciKU5ouDB5rm9JYxRwVrNiU1iLQaxCOjP=w694-h330-no",
    loginImage: "https://lh3.googleusercontent.com/pw/ACtC-3ePab0rs38kJuYAJjI40TskjKrVSRo3MVoq9_3SsFXUabvQ1pUw1IrZ-5ryX9uhbMDVRVuFKF-rkwqbY0BFGJfY_ZTxyLeJRTnLBmy5yqr7Qzh2b9KMwGFAUxT4ZAqE3-_VQFxcOoRAia8VH9dSSJvZ=w694-h114-no?authuser=0",
    bottomBrandImage: "https://lh3.googleusercontent.com/pw/ACtC-3dEVjcFIiM3pjywXHxoVPAAGKu6eOX5hQeIRkW33ysMJj0T08_qBrpZY9GFst05FdOanEvsfcTPXW2O71aWLC5GPeanut2EBhL3A3gyfH04WMGh3B6GqH6wF0zjSg-GovlNHvi3fSGzfMgHHfBz-dwr=w694-h538-no?authuser=0",
    postInstallationImage: "https://lh3.googleusercontent.com/pw/ACtC-3e1tRxLSar16QqsoSuTpYmt1MszHjRM3r49ekDlhw4yCiam71Nzm5NgWvYKeCXGWf4sHY8l862RvMrS5G5m4o64JlD8mpxJnqhIKy4nu_z6yG6tC8J7ASvYl97J2_ohejefNJF3liGdkZ-3V7sVVlzl=w1590-h996-no?authuser=0" }


  _["PRODUCTION"] = {
    domain : "co",
    conferenceSolutionName: "Around Meeting",
    clientId: "c0x3yxc8gvv5wyhcb1uhaac37zmbjxh9.around.co",
    clientSecret:  "7wq8x9v0e4j08s8xh62igx6heei92f40",
    conferenceDataNotes: "To change this link from a one-off meeting to a recurring room, open our add-on (on the right-hand side) and pick the specific room from there",
    joiningInstructions: "https://docs.google.com/document/d/16So-Va17ShrIgrP47aMH1id_6yT87YpabqcH_2qQOOI/edit",
    version:3,
    // images
    defaultAvatarImage:  "https://lh3.googleusercontent.com/pw/ACtC-3ceF6_LqqelWtzNP31BZEX9pK92VHd4X4goMBjmgXc8qeJ1qBfqxIGkMKOE7YVUhcemcmqpO8plaY8YUwkxd5WzCmc98whBTByHW70QrGF0DXiY_arXSYYQUwpyRj3C9f71MB-uqwCMEtdSgtIynLU=s96-no?authuser=0",
    topBrandImage: "https://lh3.googleusercontent.com/pw/ACtC-3dMZmf3ns_eVkTH7CCzPs0kFn_vt2WVaCIDPegYVDKdmgt7w-opZu93h4754xwMLAaWAKG9hJE2DG_kc6Mj8C5_bN4_moIRd1XvTb3LOeJ0X4VJQrsu4aNcJYZdFW7fO-Ts9IlOr7z9DB9gSdZdUaI=w694-h330-no?authuser=0" ,
    loginImage: "https://lh3.googleusercontent.com/pw/ACtC-3efO3S-Qw2nR6X-tSPa6poPE0GFMYGxWEsWjaP2To_Uk5O3CsGj2sIXcKWPSmXmbDCWz0F5c_96MHXSaFdjQIWCSb0090hpfU680HgpacGa2HhOKg6qVsoJdp0e_zHvFDXXWHznVxkShpWM167lG6w=w694-h114-no?authuser=0",
    bottomBrandImage: "https://lh3.googleusercontent.com/pw/ACtC-3fu4KGEhykgRIZGNh9f4cVf3L3PY1ODqbhRIJZHTlwqCIwT8gOSx8iPf3-N7-a-j8zt9CR51qRUDiJlXtLADtPu-IX--i-sjxTpFAfuzxJEptLHAez4TMvDHINMXM990bCCDwiFdV523csYfz-dckY=w694-h538-no?authuser=0",
    postInstallationImage: "https://lh3.googleusercontent.com/pw/ACtC-3frVtkntOQBuABnIJrMtIhs_BtzjYGM1mkwHBYgylahRUSUQvMyKSR1KpoDulptxJLpu9QEKvwJKGCCS86yMsZi_vZ-U6KUSc42Y00O5jeU692vhi9j1zvyHXLaBIjp-ii3qu1nZ419SRBxpfOsb--h=w2078-h1298-no?authuser=0"
  }
  
  obj.get = function (param) {
    environment = environment || "PRODUCTION"; // fallback
    return _[environment][param]
  }
  return obj;
})(ENVIRONMENT);



/**
 * Logs the redict URI to register.
 */
function logRedirectUri() { Logger.log(OAuth2.getRedirectUri()); }
