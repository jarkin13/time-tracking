// =========================================================================
// CREATE BIWEEKLY REMINDER - DIALOG CALLS FUNCTION
// =========================================================================
function deckLinkDialog() {
  var ui = SpreadsheetApp.getUi();
  
  var result = ui.prompt(
      'Biweekly Deck',
      'Please enter the link to the deck.',
       ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var link = result.getResponseText();
  
  if(button == ui.Button.OK) {
    if(link) {
      getBiweeklyData(link);
    } else {
      ui.alert('You need to enter a link, try again.');
    }
  }
}

// =========================================================================
// GET PROJECTS WITH ASSIGNED SLIDES
// =========================================================================
function getBiweeklyData(link) {
  var projects = projectData();
  var i = 0;
  
  while(i < projects.length) {
    if(projects[i].slides != '') {
      var name = '';
      var emails = '';
      if(projects[i].reps.length < 2) {
        emails = projects[i].reps[0][0];
        if(getFullName(projects[i].reps[0])) {
          name = getFullName(projects[i].reps[0]);
        }
      } else {
        emails = projects[i].reps[0] + ',' + projects[i].reps[1];
        if(getFullName(projects[i].reps[0]) && getFullName(projects[i].reps[1])) {
          name = getFullName(projects[i].reps[0]) + " and " + getFullName(projects[i].reps[1]);
        }
      };
      var slack = [];
      for(var r = 0; r < projects[i].reps.length; r++) {
        if(getSlackHandle(projects[i].reps[r])) {
          slack.push(getSlackHandle(projects[i].reps[r]));
        }
      };
      var slides = projects[i].slides;
      if(isNaN(slides)) {
        slides = slides[0].replace(/,/g , ", ");
        slides = slides.replace(/,(?=[^,]*$)/, " and");
      }
      biweeklySlack(name, slack, projects[i].project, slides, link);
      biweeklyEmail(name, emails, projects[i].project, slides, link);      
    };
    i++;
  }
}

//BIWEEKLY EMAIL FUNCTION
function biweeklyEmail(name, emails, project, slides, link) {
  var sourceOfTruth = getSourceOfTruth().getUrl();
  var body = "Hi " + name + ",<br><br>";
  body += "The bi-weekly mesh-wide meeting is again approaching (Thursday 12pm EST).<br><br>";
  body += "You are indicated in the <a href='" + sourceOfTruth + "'>Source of Truth</a> as a Rep for <strong>" + project + "</strong>.<br><br>";
  body += "For " + project + ":<br>";
  body += "- Your project is on slide(s) <b>" + slides + "</b><br>";
  body += "- Remove the <strong><span style='color: red'>BIG RED RECTANGLE</span></strong><br>";
  body += "- Update the content for your project<br>";
  body += "- <strong>Please note:</strong> Time Data will be added by Mesh Services<br>";
  body += "- Your information is <strong>due by 10 AM EST on Thursday</strong> at the latest, but please fill it in <strong>before 5pm Wednesday EST</strong><br><br>";
  body += "<b>Thank you</b><br><br>";
  body += "<a href='" + link + "'>Slide Deck</a>";

  MailApp.sendEmail({
    to: emails,
    subject: project + " Biweekly Meeting Deck",
    htmlBody: body
  });
}


//BIWEEKLY SLACK FUNCTION
function biweeklySlack(name, slack, project, slides, link) {
  var header = "*Hi " + name + "*\n";
  header += "The *bi-weekly mesh-wide meeting* is again approaching (*Thursday 12pm EST*).\n";
  header += "- For " + project + ":\n";
  
  var projectBody = "Your project is on slide(s) " + slides + "\n";
  projectBody += "Remove the *BIG RED RECTANGLE*\n";
  projectBody += "Update the content for your project\n"
  projectBody += "*Please note:* Time Data will be added by Mesh Services";
  
  var footer = "Your information is *due by 10 AM EST on Thursday* at the latest, but please fill it in *before 5pm Wednesday EST*.\n";
  footer += "*Thank you*\n\n";
  footer += "<" + link + "|Slide Deck>";
  
  for(var i = 0; i < slack.length; i++) {
    var payload = {
      "channel": "@" + slack[i],
      "username": "For " + project + ":",
      "icon_emoji": ":justdoit:",
      "link_names": 1,
      "attachments": [
          {
          "fallback": "Your information from *the previous bi-weekly mesh services meeting has been pasted into this week's deck.*",
          "pretext": header,
          "mrkdwn_in": ["pretext"]
        },
        {
          "text": projectBody,
          "mrkdwn_in": ["text"],
          "color": "#3AA3E3"
        },
        {
          "text": footer,
          "mrkdwn_in": ["text"]
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
}

// =========================================================================
// LAST REMINDERS
// =========================================================================

//BIWEEKLY EMAIL FUNCTION
function reminderBiweeklyEmail(name, emails, project, slides, link) {
  name = "Martin Koeppelmann and Stefan George";
  emails = "martin.koeppelmann@consensys.net, stefan.george@consensys.net";
  project = "Gnosis";
  slides = "48";
  link = "https://docs.google.com/presentation/d/1WAfIJiJRWoFfoPw1AtlIPuiM1Obt8LtU43RUMfP3LEU/edit#slide=id.g15d68ecd69_0_444";
  var sourceOfTruth = getSourceOfTruth().getUrl();
  var body = "Hi " + name + ",<br><br>";
  body += "According to our logs, you have not updated your bi-weekly slide(s).<br><br>";
  body += "The bi-weekly mesh-wide meeting is again approaching (Today 12pm EST).<br><br>";
  body += "You are indicated in the <a href='" + sourceOfTruth + "'>Source of Truth</a> as a Rep for <strong>" + project + "</strong>.<br><br>";
  body += "For " + project + ":<br>";
  body += "- Your project is on slide(s) <b>" + slides + "</b><br>";
  body += "- Remove the <strong><span style='color: red'>BIG RED RECTANGLE</span></strong><br>";
  body += "- Update the content for your project<br>";
  body += "- <strong>Please note:</strong> Time Data will be added by Mesh Services<br>";
  body += "<b>Thank you</b><br><br>";
  body += "<a href='" + link + "'>Slide Deck</a>";

  MailApp.sendEmail({
    to: emails,
    subject: "LAST REMINDER: " + project + " Biweekly Meeting Deck",
    htmlBody: body
  });
}


//BIWEEKLY SLACK FUNCTION
function reminderBiweeklySlack(name, slack, project, slides, link) {
  name = "Martin Koeppelmann and Stefan George";
  project = "Gnosis";
  slides = "48";
  link = "https://docs.google.com/presentation/d/1WAfIJiJRWoFfoPw1AtlIPuiM1Obt8LtU43RUMfP3LEU/edit#slide=id.g15d68ecd69_0_444";
  
  var header = "*Hi " + name + "*\n";
  header += "According to our logs, you have not updated your bi-weekly slide(s).\n\n";
  header += "The *bi-weekly mesh-wide meeting* is again approaching (*Today 12pm EST*).\n";
  header += "- For " + project + ":\n";
  
  var projectBody = "Your project is on slide(s) " + slides + "\n";
  projectBody += "Remove the *BIG RED RECTANGLE*\n";
  projectBody += "Update the content for your project\n"
  projectBody += "*Please note:* Time Data will be added by Mesh Services";
  
  var footer = "*Thank you*\n\n";
  footer += "<" + link + "|Slide Deck>";
  
    var payload = {
      "channel": "@" + getSlackHandle('stefan.george@consensys.net'),
      "username": "For " + project + ":",
      "icon_emoji": ":justdoit:",
      "link_names": 1,
      "attachments": [
          {
          "fallback": "Your information from *the previous bi-weekly mesh services meeting has been pasted into this week's deck.*",
          "pretext": header,
          "mrkdwn_in": ["pretext"]
        },
        {
          "text": projectBody,
          "mrkdwn_in": ["text"],
          "color": "#3AA3E3"
        },
        {
          "text": footer,
          "mrkdwn_in": ["text"]
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