// =========================================================================
// ADD TIME PERIOD - MENU ITEM FUNCTION
// =========================================================================
function addTimePeriod() {
  var sheet = getTimesheet();
  
  //GET LAST RECORDED END DATE
  var lastEndDate = sheet.getRange('B:B').getCell(2, 1).getValue();
  sheet.insertRowBefore(2);

  //GET THE NEXT TIME PERIOD
  var startDate = lastEndDate.addDays(1);
  var endDate = startDate.addDays(13);
  
  //ADD THE NEXT TIME PERIOD TO SHEET
  sheet.getRange('A:A').getCell(2, 1).setValue(startDate);
  sheet.getRange('B:B').getCell(2, 1).setValue(endDate);
  
  startDate = formatDate(startDate);
  endDate = formatDate(endDate);
  
  generateForm(startDate, endDate, 2, 1);
}

// =========================================================================
// CREATE FORM(S) - MENU ITEM FUNCTION
// =========================================================================
function createTimePeriodForms() {
  var timesheet = getTimesheet();
  var missingRows = getMissingForms(timesheet);
  var missingForms = getMissingForms(timesheet).length;
  
  for (i in missingRows) {
    var row = missingRows[i];
    
    var startDate = formatDate(timesheet.getRange("A:A").getCell(row, 1).getValue());
    var endDate = formatDate(timesheet.getRange("B:B").getCell(row, 1).getValue());
    
    createForm(startDate, endDate, row, missingForms);
  }
}

function getMissingForms(sheet) {
  var lR = getNextRow(sheet);
  var timePeriodsForms = sheet.getRange("C1:C" + lR).getValues();
  var missingForms = [];
  for(i in timePeriodsForms) {
    if (timePeriodsForms[i][0] == "") {
      var row = Number(i) + 1;
      missingForms.push(row);
    }
  }
  return missingForms;
}

// =========================================================================
// DIALOG TO CREATE FORM
// =========================================================================
function generateForm(startDate, endDate, row, missingForms) {
  var ui = SpreadsheetApp.getUi();
  
  var result = ui.alert(
    'Create form for ' + startDate + ' - ' + endDate,
    'Would you like to create form?',
    ui.ButtonSet.YES_NO_CANCEL);
  
  if(result == ui.Button.YES) {
    createForm(startDate, endDate, row, missingForms);
  }
}

// =========================================================================
// CREATE FORM
// =========================================================================
function createForm(startDate, endDate, row, missingForms) {
  var timesheet = getTimesheet();
  var folder = getFolder();
  
  updateForm();
  var formId = getFormDrive().makeCopy(folder).setName(startDate + ' - ' + endDate + ' | Time Tracking').getId();
  var form = FormApp.openById(formId);
  
  form.setTitle(startDate + ' - ' + endDate + ' | Time Tracking');
  form.setDescription('Enter the percentage of time you have spent on up to 5 main projects you have worked on over this time period '  + startDate + ' - ' + endDate + '. If you have have worked on a project that is not in the list, please specify it in the text box at the bottom. Regardless if you enter time off, always add 100% of your time for projects. We will take into account the days you took time off for. Please do not forget to send your invoice for this time period as well.');
  
  var ss = SpreadsheetApp.create('Responses');
  //DELETE RESPONSE
  var ssId = ss.getId();  
  var ssFile = DriveApp.getFileById(ssId);
  ssFile.setTrashed(true);
  //MOVE RESPONSE
  var responseId = ssFile.makeCopy(folder).setName(startDate + ' - ' + endDate + ' | Responses').getId();
  var response = SpreadsheetApp.openById(responseId);
  
  form.setDestination(FormApp.DestinationType.SPREADSHEET, responseId);
  timesheet.getRange('C:C').getCell(row,1).setValue(form.getPublishedUrl()); 
  timesheet.getRange('D:D').getCell(row,1).setValue(response.getUrl());
  
  if(missingForms < 2) {
    generateSlackFormLink(startDate, endDate, form.getPublishedUrl());
  }
}

function updateForm() {
  var formId = getFormDrive().getId();
  var form = FormApp.openById(formId);
  var formItems = form.getItems();
  
  var data = projectData();
  var enterPriseData = enterpriseProjectData();
  
  var i = 0, f = 0;
  while(i < formItems.length) {
    if(formItems[i].getType() == 'LIST' && f < 10) {
      var listItem = formItems[i].asListItem();
      listItem.setChoices(projectChoices(listItem, data));
      f++;
    };
    if(formItems[i].getType() == 'LIST' && f > 10) {
      var listItem = formItems[i].asListItem();
      listItem.setChoices(enterpriseChoices(listItem, enterPriseData));
    }
    i++;
  }
}

function projectChoices(item, projects) {
  var choices = [];
  var i = 0;
  projects.forEach(function (project) {
    if( project.project != null && project.category != 'TimeOff') {
      choices[i] = item.createChoice(project.project);
      i++;
    }
  });
  return choices;
}

function enterpriseChoices(item, projects) {
  var choices = [];
  var i = 0;
  projects.forEach(function (project) {
    if( project.project != null ) {
      choices[i] = item.createChoice(project.project);
      i++;
    }
  });
  return choices;
}

// =========================================================================
// SEND FORM LINK TO SLACK DIALOG
// =========================================================================
function generateSlackFormLink(startDate, endDate, form) {
  var ui = SpreadsheetApp.getUi();
  
  var result = ui.alert(
    'Slack ' + startDate + ' - ' + endDate + ' Form?',
    'This will be send to #priv-consensys-member.',
    ui.ButtonSet.YES_NO_CANCEL);
  
  if(result == ui.Button.YES) {
    postForm(startDate, endDate, form);
  }
}

// =========================================================================
// CREATE NEW FORM TEMPLATE
// =========================================================================
function createFormTemplate() {
  var timesheet = getTimesheet();
  var folder = getFolder();
  var ff = FormApp.create('Time Tracking');
  
  ff.setCollectEmail(true);
  ff.setAllowResponseEdits(true);
  ff.setLimitOneResponsePerUser(true);
  
  createFormFields(ff);
  
  //DELETE FORM
  var ffId = ff.getId();
  var ffFile = DriveApp.getFileById(ffId);   
  ffFile.setTrashed(true);
  //MOVE FORM
  var formId = ffFile.makeCopy(folder).setName('1 NEW Form Template - DO NOT DELETE').getId();
  var form = FormApp.openById(formId);
  
  Logger.log(formId);
}

function createFormFields(form) {
  //function in Code.gs
  var data = projectData();
  var enterPriseData = enterpriseProjectData();
  
  for(var i = 1; i < 11; i++) {
    var sectionHeader = form.addSectionHeaderItem();
    sectionHeader.setTitle(i + '. Add Project');
    
    var projectItem = form.addListItem();
    projectItem.setTitle('Choose Project');
    projectItem.setChoices(projectChoices(projectItem, data));

    var timeItem = form.addTextItem();
    timeItem.setTitle('Percentage of your time spent on Project.');
    timeItem.setHelpText('Please only enter a numerical value');
  }
  
  var newProjectHeader = form.addSectionHeaderItem();
  newProjectHeader.setTitle('Other Project');
  
  var newProjectItem = form.addTextItem();
  newProjectItem.setTitle('Add Custom Project');
  
  var newTimeItem = form.addTextItem();
  newTimeItem.setTitle('Percentage of your time spent on Project.');
  newTimeItem.setHelpText('Please only enter a numerical value');
  
  var timeOffHeader = form.addSectionHeaderItem();
  timeOffHeader.setTitle('Time Off');
  
  var personalVactionItem = form.addTextItem();
  personalVactionItem.setTitle('How many days did you take personal and vacation time off?');
  personalVactionItem.setHelpText('Please only enter a numerical value');
  
  var nationalHolidayItem = form.addTextItem();
  nationalHolidayItem.setTitle('How many off were you for a national holiday?');
  nationalHolidayItem.setHelpText('Please only enter a numerical value');
  
  var enterpriseSection = form.addPageBreakItem().setTitle('Enterprise');
  enterpriseSection.setHelpText('PLEASE ONLY FILL THIS OUT IF YOU SPENT TIME IN THE ENTERPRISE-CLIENT DELIVERY CATEGORY.');
  
  for(var i = 1; i < 3; i++) {
    var enterpriseHeader = form.addSectionHeaderItem();
    enterpriseHeader.setTitle(i + '. Client Project');
    
    var enterpriseItem = form.addListItem();
    enterpriseItem.setTitle('Choose Project');
    enterpriseItem.setChoices(enterpriseChoices(enterpriseItem, enterPriseData));

    var enterpriseTimeItem = form.addTextItem();
    enterpriseTimeItem.setTitle('How many hours spent on Project.');
    enterpriseTimeItem.setHelpText('Please only enter a numerical value');
  }
  
  var feedbackSection = form.addPageBreakItem().setTitle('Feedback');
  var feedbackItem = form.addTextItem();
  feedbackItem.setTitle('Comments');
  feedbackItem.setHelpText('Please provide us with any comments you have in regards to the time tracking form');
}

function addTimeColumns() {
  var choices = [];
  var i = 0;
  for (var t = 1; t < 101; t++) {
    if(t % 5 == 0) {
      choices[i] = t;
      i++;
    }
  }
  return choices;
}
