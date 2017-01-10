//GLOBAL FUNCTIONS
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Time Tracker')
      .addItem('Add New Time Period', 'addTimePeriod')
      .addItem('Create Form(s)', 'createTimePeriodForms')
      .addSeparator()
      .addSubMenu(ui.createMenu('Reports')
          .addItem('Report Resource Bank', 'setEmployeesResource')
          .addItem('Report Missing Employees', 'generateMissingReport')
          .addItem('Report Team Members', 'generateTeamReport')
          .addItem('Report Enterprise Members', 'generateEnterpriseReport')
          .addItem('Report Feedback', 'generateFeedbackReport')
          .addItem('Report Members Time', 'generateTimeReport'))
      .addSubMenu(ui.createMenu('Reminders')
          .addItem('Biweekly Reminder', 'deckLinkDialog')
          .addItem('Slack & Email Form Link', 'toolbarSlackFormLink')
          .addItem('Remind Missing Users', 'sendReminder' ))
      .addSubMenu(ui.createMenu('Survey Reports')
          .addItem('Send Survey', 'surveyFormDialog')
          .addItem('Report Missing Employees', 'generateSurveyMissingReport'))
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function getSalaries(sheet) {
  return sheet.getSheetByName('Salaries');
}

function getEmployees() {
  return getSheet().getSheetByName('Employees');
}

function getEmployeesList() {
  return getSheet().getSheetByName('Employees');
}

function getTimesheet() {
  return getSheet().getSheetByName('Time Period');
}

function getResourceBank() {
  return getSheet().getSheetByName('Resource Bank');
}

function getTeamDetails(sheet) {
  return sheet.getSheetByName('Team Details');
}

function getEnterpriseReport(sheet) {
  return sheet.getSheetByName('Enterprise Report');
}

function getMissingReport(sheet) {
  return sheet.getSheetByName('Missing Forms');
}

function getProjectValues() {
  return getSheet().getSheetByName('Projects');
}

function getProjectCategories() {
  return getSheet().getSheetByName('Project Categories');
}

function getEnterpriseProjectValues() {
  return getSheet().getSheetByName('Enterprise Client Projects');
}

function getFormResponses(sheet) {
  return sheet.getSheetByName('Form Responses 1');
}

function getTimeReport(sheet) {
  return sheet.getSheetByName('Employee Time');
}

function getFeedbackReport(sheet) {
  return sheet.getSheetByName('Employee Feedback');
}

function getAllEmployeesEmails() {
  var employees = getEmployeesList();
  var emails = employees.getRange('D:D').getValues();
  return emails;
}

function getFormStartDate(report) {
  var timesheet = getTimesheet();
  var timePeriods = timesheet.getRange('D:D').getValues();
  
  for(i in timePeriods) {
    if(timePeriods[i][0] == report) {
      var row = Number(i) + 1;
      return timesheet.getRange('A:A').getCell(row, 1).getValue();
    }
  }
}

function getSlackHandle(email) {
  var employees = getEmployeesList();
  var emails = getAllEmployeesEmails();
  for(i in emails) {
    if( emails[i][0] == email ) {
      var row = Number(i) + 1;
      return employees.getRange('E:E').getCell(row, 1).getValue();
    }
  }
}

function getFullName(email) {
  var employees = getEmployeesList();
  var emails = getAllEmployeesEmails();
  for(i in emails) {
    if(emails[i][0] == email) {
      var row = Number(i) + 1;
      var first = employees.getRange('B:B').getCell(row, 1).getValue();
      var last = employees.getRange('A:A').getCell(row, 1).getValue();
      return first + ' ' + last;
    }
  }
}

function getStartDate(email) {
  var employees = getEmployeesList();
  var emails = getAllEmployeesEmails();
  for(i in emails) {
    if(emails[i][0] == email) {
      var row = Number(i) + 1;
      var startDate;
      if(employees.getRange('G:G').getCell(row, 1).getValue() != '') {
        startDate = employees.getRange('G:G').getCell(row, 1).getValue();
      }
      if(employees.getRange('H:H').getCell(row, 1).getValue() != '') {
        startDate = employees.getRange('H:H').getCell(row, 1).getValue();
      }
      return startDate;
    }
  }
}

function getEndDate(email) {
  var employees = getEmployeesList();
  var emails = getAllEmployeesEmails();
  for(i in emails) {
    if(emails[i][0] == email) {
      var row = Number(i) + 1;
      var endDate;
      if(employees.getRange('I:I').getCell(row, 1).getValue() != '') {
        endDate = employees.getRange('I:I').getCell(row, 1).getValue();
      }
      return endDate;
    }
  }
}

function formatDate(date) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  
  return month + '/' + day + '/' + year;
}

function getNextRow(sheet) {
  var rows = sheet.getRange('A:A').getValues();
  
  for (i in rows) {
    if(rows[i][0] == '') {
      return Number(i);
      break;
    }
  }
}

function getNextColumn(sheet, row) {
  var lastColumn = sheet.getLastColumn();
  for(var i = 0; i < lastColumn; i++) {
    var column = Number(i) + 1;
    var value = sheet.getRange(row, column).getValue();
    if(value != '' && column == lastColumn) {
     column = column + 1;
     return column
    } else if(value == '') {
     return column;
    }
  }
}

function projectData() {
  var projects = getProjectValues().getRange('A2:A1000').getValues();
  var categories = getProjectValues().getRange('B2:B1000').getValues();
  var rep1 = getProjectValues().getRange('C2:C1000').getValues();
  var rep2 = getProjectValues().getRange('D2:D1000').getValues();
  var slides = getProjectValues().getRange('E2:E1000').getValues();
  var lR = getNextRow(getProjectValues());
  var values = [], v = 0;
  
  for(var i = 1; i < lR - 1; i++) {
    var reps = [];
    if(rep1[i] != '') {
      reps.push(rep1[i]);
    }
    if(rep2[i] != '') {
      reps.push(rep2[i]);
    }
    values[v] = {
      'project': projects[i],
      'category': categories[i],
      'reps': reps,
      'slides': slides[i]
    };
    v++;
  }
  
  return values;
}

function projectCategories() {
  var categories = getProjectCategories().getRange('A2:A1000').getValues();
  var labels = getProjectCategories().getRange('B2:B1000').getValues();
  var descriptions = getProjectCategories().getRange('C2:C1000').getValues();
  var lR = getNextRow(getProjectCategories());
  var values = [];

  for(var i = 0; i < lR - 1; i++) {
    values[i] = {
      'category': categories[i],
      'label': labels[i],
      'description': descriptions[i]
    };
  }

  return values;
}

function enterpriseProjectData() {
  var projects = getEnterpriseProjectValues().getRange('A2:A1000').getValues();
  var rep1 = getEnterpriseProjectValues().getRange('B2:B1000').getValues();
  var rep2 = getEnterpriseProjectValues().getRange('C2:C1000').getValues();
  var lR = getNextRow(getEnterpriseProjectValues());
  var values = [];

  for(var i = 0; i < lR - 1; i++) {
    values[i] = {
      'project': projects[i],
      'reps': [rep1[i], rep2[i]]
    };
  }
  
  return values;
}

function employeeTimeData(report) {
  var lastResponse = getNextRow(getFormResponses(report));
  var values = [];
  
  for(var i = 0; i < lastResponse - 1; i++) {
    var row = i + 2;
    var column = 3;
    var p = 0;
    var cP = 0;
    var email = getFormResponses(report).getRange(row, 2).getValue();
    values[i] = {
      'email': email,
      'fullName': getFullName(email),
      'startDate': getStartDate(email),
      'endDate': '',
      'percentage': 0,
      'projects': [],
      'timeOff': {
        'vacationPersonalTime': 0,
        'nationalHoliday': 0,
        'total': 0
      },
      'clientProjects': [],
      'feedback': ''
    }
    
    while(column < 25) {
      var time = getFormResponses(report).getRange(row, column).getValue();
      if(time != '') {
        if(!isNaN(time)) {
          var percentage = getFormResponses(report).getRange(row, column).getValue();
          values[i].percentage = values[i].percentage + percentage; 
        } else {
          var project = getFormResponses(report).getRange(row, column).getValue();
              project = project.split(' - ');
          var percentage = getFormResponses(report).getRange(row, column + 1).getValue();
          values[i].projects[p] = {
            'project': project[0],
            'percentage': percentage
          }
          if(column == 23) {
            values[i].projects[p].newProject = true;
          }
          p++;
        }
      }
      column++;
    }
    
    if(column == 25) {
      var days = getFormResponses(report).getRange(row, column).getValue();
      values[i].timeOff.vacationPersonalTime = days;
      values[i].timeOff.total = values[i].timeOff.total + days;
      
      column = column + 1;
    }

    if(column == 26) {
      var days = getFormResponses(report).getRange(row, column).getValue();
      values[i].timeOff.nationalHoliday = days;
      values[i].timeOff.total = values[i].timeOff.total + days;
      
      column = column + 1;
    }
    
    while(column < 31) {
      var time = getFormResponses(report).getRange(row, column).getValue();
      if(time != '') {
        if(isNaN(time)) {
          var clientProject = getFormResponses(report).getRange(row, column).getValue();
          var hours = getFormResponses(report).getRange(row, column + 1).getValue();
          values[i].clientProjects[cP] = {
            'project': clientProject,
            'hours': hours
          };
          cP++;
        }
      }
      column++;
    }
    
    if(column == 31) {
      var feedback = getFormResponses(report).getRange(row, column).getValue();
      if(feedback != '') {
        values[i].feedback = feedback;
      }
    }
  }

  return values;
}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}