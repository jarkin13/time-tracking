// =========================================================================
// REPORT MISSING EMPLOYEES - MENU ITEM FUNCTION
// =========================================================================
function generateMissingReport() {
  var dialog1 = {
    'title': 'Response Form',
    'customTitle': false,
    'subText': 'Would you like to generate a missing report?'
  };
  
  var dialog2 = {
    'title': 'Enter Time Tracking Response Link',
    'subText': 'Please enter the response link to generate team report:'
  }
  
  reportDialog(dialog1, createMissingReport, dialog2);
}

// =========================================================================
// CREATE MISSING REPORT
// =========================================================================
function createMissingReport(report, activeRow, ui) {
  var missingNum = 0;
  if(!report.getSheetByName('Missing Forms')) {
    report.insertSheet('Missing Forms', 2);
  } else {
    missingNum = getNextRow(getMissingReport(report)) - 1;
    getMissingReport(report).clear();
  }
   
  getMissingReport(report).getRange('A:A').getCell(1, 1).setValue('Employees').setFontWeight('bold');
  getMissingReport(report).getRange('B:B').getCell(1, 1).setValue('Not Logged').setFontWeight('bold');
  getMissingReport(report).getRange('C:C').getCell(1, 1).setValue('Company Employees').setFontWeight('bold');
  getMissingReport(report).getRange('D:D').getCell(1, 1).setValue('Affiliates').setFontWeight('bold');
  var values = getMissingValues(report), total = 0;

  var currentRow;
  var nR = 1, nRCompEmply = 1, nRAff = 1, nCR = 1;
  var remindMissing = [];
  for(i in values) {
    if(values[i].missing) {
      if(values[i].slack) {
        if(values[i].company == 'Affiliate') {
          nRAff++;
          getMissingReport(report).getRange('D:D').getCell(nRAff, 1).setValue(values[i].slack);
        } else if(values[i].company) {
          nRCompEmply++;
          getMissingReport(report).getRange('C:C').getCell(nRCompEmply, 1).setValue(values[i].slack);
        } else {
          nR++;
          getMissingReport(report).getRange('A:A').getCell(nR, 1).setValue(values[i].slack);
          total++;
          var m = {
            'slack': values[i].slack,
            'email': values[i].email,
            'fullName': values[i].fullName
          };
          remindMissing.push(m);
        }
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
    remindUsers(remindMissing, activeRow, ui, 'The report is the same, but would you like to remind these users?');
  } else if(total > 0) {
    remindUsers(remindMissing, activeRow, ui, 'Would you like to remind these users?');
  } else {
    ui.alert('No one has yet filled out this form, please generate later');
  }
}

function containsObject(obj, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == obj.email) {
      list[i].logged = true;
      return true;
    }
  }
  return false;
}


function getMissingValues(report) {
  var employeeResponses = employeeTimeData(report);
  var total = employeeResponses.length;
  var lastResponse = getNextRow(getFormResponses(report));
  var lastEmployee = getNextRow(getEmployeesList());
  var values = [], r = 0, today = new Date();
  
  var url = report.getUrl();
  var formStartDate = getFormStartDate(url);
  for(var i = 0; i < lastEmployee - 1; i++) {
    var row = i + 3;
    var email = getEmployeesList().getRange(row, 4).getValue();
    var obj = { 'email': email };
    var ignore = false;
    if(!containsObject(obj, employeeResponses)) {
      var endDate = getEmployeesList().getRange(row, 9).getValue();
      if(endDate != '') {
        endDate = new Date(endDate);
        if(today > endDate) {
          ignore = true;
        }
      }
      var startDate = getEmployeesList().getRange(row, 8).getValue();
      var startDate2 = getEmployeesList().getRange(row, 7).getValue();
      if(startDate != '') {
        startDate = new Date(startDate);
      }
      if(startDate2 != '') {
        startDate = new Date(startDate2);
      }
      if(startDate != '') {
        var formstartdate = new Date(formStartDate);
        if(today < startDate || startDate > formstartdate) {
          ignore = true;
        }
      }
      if(!ignore) {
        employeeResponses[total] = {
          'email': email,
          'fullName': getFullName(email),
          'slack': false,
          'missing': true,
          'company': false,
          'logged': true
        }
        if(getSlackHandle(email)) {
          employeeResponses[total].slack = getSlackHandle(email);
        }
        var company = getEmployeesList().getRange(row, 11).getValue();
        if(company != 'ConsenSys') {
          employeeResponses[total].company = company;
        }
        total = total + 1;
      }
    };
  }
  
  return employeeResponses;
}

// =========================================================================
// REMIND USERS IN SLACK AFTER REPORT IS CREATED - MENU ITEM FUNCTION
// =========================================================================
function remindUsers(missing, row, ui, text, survey) {
  if(row) {
    var form = getTimesheet().getRange('C:C').getCell(row, 1).getValue();
    var startDate = formatDate(getTimesheet().getRange('A:A').getCell(row, 1).getValue());
    var endDate = formatDate(getTimesheet().getRange('B:B').getCell(row, 1).getValue());
  }
  
  var result = ui.alert(
    'Slack Message and Email',
    text,
    ui.ButtonSet.OK_CANCEL);
  
  if(row) {
    if(result == ui.Button.OK) {
      reminderMessage(missing, form, startDate, endDate, ui);
    }
  } else {
    if(result == ui.Button.OK) {
      surveyReminderMessage(missing, survey, ui);
    }
  }
}

function getFullNameString() {
  var report = SpreadsheetApp.openById('1061ud1M1dYu-4qL7xbz1iNZYKoBV3HSpEYtFHWaILa8');
  var values = getMissingValues(report);
  var string = '';
  for(i in values) {
    if(values[i].missing && !values[i].company) {
      string += values[i].fullName + ' ';
    }
  }
  
  Logger.log(string);
}