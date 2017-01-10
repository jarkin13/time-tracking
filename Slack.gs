function postForm(startDate, endDate, form) {
  var payload = {
    "channel": "#priv-consensys-member",
    "username": "Time Tracking: " + startDate + ' - ' + endDate,
    "icon_emoji": ":chilling:",
    "link_names": 1,
    "attachments": [
      {
        "fallback": "Time tracking form now available to fill out. Please do so at your earliest convenience.",
        "pretext": "<!channel>: Every second week, ConsenSys will be measuring the effort spent by its members on projects via the Coordination teams’ Time Tracker. Please <" + form + "|click this link> and enter the percentage of your time spent on projects for the period indicated. If you have questions, please ask in <https://consensys.slack.com/archives/priv-consensys-member|#priv-consensys-member>.",
        "mrkdwn_in": ["pretext"],
        "color": "#D00000"
      }
    ]
  }

  var url = 'https://hooks.slack.com/services/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';
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(url, options);

  var body = "Hi Everyone! <br><br>";
  body += "Every second week, ConsenSys will be measuring the effort spent by its members on projects via the Coordination teams’ Time Tracker.<br><br>"
  body += "Please <a href='" + form + "'>click this link</a> and enter the percentage of your time spent on projects for the period of <b>" + startDate + ' - ' + endDate + "</b>. If you have questions, please ask in <a href='https://consensys.slack.com/archives/priv-consensys-member'>#priv-consensys-member</a>.<br><br>"
  body += "-The Mesh Services Team";

  MailApp.sendEmail({
    to: 'everyone@consensys.net',
    subject: "Time Tracking: " + startDate + ' - ' + endDate,
    htmlBody: body
  });

  var ui = SpreadsheetApp.getUi();
  ui.alert('You have posted the form link to Slack');
}

function reminderMessage(missing, form, startDate, endDate, ui) {
  for(var i = 0; i < missing.length; i++) {
    if( missing[i].slack ) {
      var slackHandle = missing[i].slack;
      var payload = {
        "channel": "@" + slackHandle,
        "username": "Please fill out Time Tracking form",
        "icon_emoji": ":justdoit:",
        "link_names": 1,
        "attachments": [
          {
          "fallback": "According to our logs, you have not filled in the ConsenSys Time Tracker for the period " + startDate + " - " + endDate + ".",
          "pretext": "According to our logs, you have not filled in the ConsenSys Time Tracker for the period " + startDate + " - " + endDate + ". Every second Friday, the Time Tracker posts a link in <https://consensys.slack.com/archives/priv-consensys-member|#priv-consensys-member> which you must have missed this time around. Please <" + form + "|click this link> and enter the percentage of your time spent on projects for the period indicated. If you have questions, please ask in <https://consensys.slack.com/archives/priv-consensys-member|#priv-consensys-member>.",
          "mrkdwn_in": ["pretext"],
          "color": "#D00000"
          }
        ]
      }
    
      var url = 'https://hooks.slack.com/services/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';
      var options = {
        'method': 'post',
        'payload': JSON.stringify(payload)
      };
    
      var response = UrlFetchApp.fetch(url, options);
    }
    if( missing[i].email ) {
      var body = "Hi " + missing[i].fullName +  "<br><br>";
          body += "According to our logs, you have not filled in the <b>ConsenSys Time Tracker</b> for the period <b>" + startDate + " - " + endDate + "</b>.<br><br>";
          body += "Every second Friday, the Time Tracker posts a link in <a href='https://consensys.slack.com/archives/priv-consensys-member'>#priv-consensys-member</a> which you must have missed this time around. Please <a href='" + form + "'>click this link</a> and enter the percentage of your time spent on projects for the period indicated. If you have questions, please ask in <a href='https://consensys.slack.com/archives/priv-consensys-member'>#priv-consensys-member</a>.<br><br>"
          body += "-The Mesh Services Team";
      MailApp.sendEmail({
        to: missing[i].email,
        subject: "Missing Time Tracking: " + startDate + ' - ' + endDate + " Form",
        htmlBody: body
      });
    }
  }
  ui.alert('You have sent a remind for ' + startDate + ' - ' + endDate);
}