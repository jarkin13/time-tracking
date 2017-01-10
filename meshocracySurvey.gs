// =========================================================================
// SEND OUT SURVERY FORM - DIALOG CALLS FUNCTION
// =========================================================================
function surveyFormDialog() {
  var ui = SpreadsheetApp.getUi();
  
  var result = ui.prompt(
      'Send Out Survey',
      'Please enter the link to the form.',
       ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var link = result.getResponseText();
  
  if(button == ui.Button.OK) {
    if(link) {
      postSurvey(link);
    } else {
      ui.alert('You need to enter a link, try again.');
    }
  }
}

function postSurvey(form) {
  var payload = {
    "channel": "#priv-consensys-member",
    "username": "Meshocracy Survey",
    "icon_emoji": ":disappointed2:",
    "link_names": 1,
    "attachments": [
      {
        "fallback": "We are seeking to learn more about the current state of the ConsenSys mesh in order to help us prepare for Bali and the operational changes we'll be discussing there. Please fill out this form below by Tuesday, September 6 5pm EST.",
        "pretext": "<!channel> We are seeking to learn more about the current state of the ConsenSys mesh in order to help us prepare for Bali and the operational changes we'll be discussing there. Please fill out this form below by *Tuesday, September 6 5pm EST*.",
        "title": "Meshocracy Survey",
        "title_link": form,
        "footer": "ConsenSys",
        "footer_icon": "http://i67.tinypic.com/1z23afq.png",
        "mrkdwn_in": ["pretext"],
        "color": "#3AA3E3"
      }
    ]
  }

  var url = 'https://hooks.slack.com/services/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';
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };
  
  var response = UrlFetchApp.fetch(url, options);

  var body = "Hi Everyone<br><br>";
  body += "As Carolyn mentioned yesterday, we are seeking to learn more about the current state of the ConsenSys mesh in order to help us prepare for Bali and the operational changes we'll be discussing there. Please fill out this form below by <strong>Tuesday, September 6 5pm EST</strong>.<br><br>",
  body += "Please <a href='" + form + "'>click this link</a> to fill out the Meshocracy Survey.<br><br>";
  body += "We appreciate your feedback!<br><br>";
  body += "-Alex, Carolyn, Russell";
    
  MailApp.sendEmail({
    to: 'jamie.arkin@consensys.net',
    subject: " Meshocracy Survey",
    htmlBody: body
  });

  var ui = SpreadsheetApp.getUi();
  ui.alert('You have posted the form link to Slack and emailed everyone');
}

// =========================================================================
// REPORT MISSING EMPLOYEES - MENU ITEM FUNCTION
// =========================================================================

function generateSurveyMissingReport() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
      'Survey | Remind Missing Employees',
      'Please enter the edit to the form.',
       ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var link = FormApp.openByUrl(result.getResponseText());
  var report = FormApp.openByUrl(result.getResponseText()).getDestinationId();
      report = SpreadsheetApp.openById(report);
      
  if(button == ui.Button.OK) {
    if(link) {
      createSurveyMissingReport(report, false, ui, link.getPublishedUrl());
    } else {
      ui.alert('You need to enter a link, try again.');
    }
  }
}

// =========================================================================
// CREATE MISSING REPORT
// =========================================================================
function createSurveyMissingReport(report, activeRow, ui, survey) {
  var missingNum = 0;
  if(!report.getSheetByName('Missing Forms')) {
    report.insertSheet('Missing Forms', 2);
  } else {
    missingNum = getNextRow(getMissingReport(report)) - 1;
    getMissingReport(report).clear();
  }
   
  getMissingReport(report).getRange('A:A').getCell(1, 1).setValue('Employees').setFontWeight('bold');
  getMissingReport(report).getRange('B:B').getCell(1, 1).setValue('Not Logged').setFontWeight('bold');
  //FOUND IN reportMissing.gs
  var values = getMissingValues(report), total = 0;

  var currentRow;
  var nR = 1, nCR = 1;
  var remindMissing = [];
  for(i in values) {
    if(values[i].missing) {
      if(values[i].slack) {
        nR++;
        getMissingReport(report).getRange('A:A').getCell(nR, 1).setValue(values[i].slack);
        total++;
        var m = {
          'slack': values[i].slack,
          'email': values[i].email,
          'fullName': values[i].fullName
        };
        remindMissing.push(m);
      } else {
        nCR++;
        getMissingReport(report).getRange('B:B').getCell(nCR, 1).setValue(values[i].email);
      }
    }
    if(!values[i].logged) {
      nCR++;
      getMissingReport(report).getRange('B:B').getCell(nCR, 1).setValue(values[i].email);
    }
  }

  if(total == missingNum) {
    //FOUND IN reportMissing.gs
    remindUsers(remindMissing, activeRow, ui, 'The report is the same, but would you like to remind these users?', survey);
  } else if(total > 0) {
    //FOUND IN reportMissing.gs
    remindUsers(remindMissing, activeRow, ui, 'Would you like to remind these users?', survey);
  } else {
    ui.alert('No one has yet filled out this form, please generate later');
  }
}

// =========================================================================
// SURVEY REMINDER MESSAGE
// =========================================================================
function surveyReminderMessage(missing, form, ui) {
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
            "fallback": "According to our logs, you have not filled in the Meshocracy Survey.",
            "pretext": "According to our logs, you have not filled in the Meshocracy Survey.\n\n We are seeking to learn more about the current state of the ConsenSys mesh in order to help us prepare for Bali and the operational changes we'll be discussing there.",
            "title": "Meshocracy Survey",
            "title_link": form,
            "footer": "ConsenSys",
            "footer_icon": "http://i67.tinypic.com/1z23afq.png",
            "mrkdwn_in": ["pretext"],
            "color": "#3AA3E3"
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
            body += "According to our logs, you have not filled in the Meshocracy Survey.\n\n We are seeking to learn more about the current state of the ConsenSys mesh in order to help us prepare for Bali and the operational changes we'll be discussing there.<br><br>";
            body += "Please <a href='" + form + "' style='font-weight:bold'>click this link</a> to fill out the Meshocracy Survey.<br><br>";
            body += "We appreciate your feedback!<br><br>";
            body += "-Alex, Carolyn, Russell";
            body += "-The Mesh Services Team";
        MailApp.sendEmail({
          to: missing[i].email,
          subject: "Missing Meshocracy Survey",
          htmlBody: body
        });
      }
  }
  ui.alert('You have sent a remind for the Meshocracy Survey');
}