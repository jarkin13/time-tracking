// =========================================================================
// Dialog function to creating reports - MENU ITEM FUNCTION
// =========================================================================
function reportDialog(dialog1, callback, dialog2) {
  var ui = SpreadsheetApp.getUi();
  var active = SpreadsheetApp.getActiveSheet().getActiveRange();
  var sheet = getSheet();
  var timesheet = sheet.getSheetByName("Time Period");
  var report, startDate, endDate, activeRow;
  
  if(active.getColumn() == 4 && SpreadsheetApp.getActiveSheet().getName() == 'Time Period' && active.getValue() != '') {
    report = SpreadsheetApp.openByUrl(timesheet.getRange("D:D").getCell(active.getRow(), 1).getValue());
    startDate = formatDate(timesheet.getRange("A:A").getCell(active.getRow(), 1).getValue());
    endDate = formatDate(timesheet.getRange("B:B").getCell(active.getRow(), 1).getValue());
    activeRow = active.getRow();
  } else {
    var row = 2;
    startDate = formatDate(timesheet.getRange("A:A").getCell(row, 1).getValue());
    endDate = formatDate(timesheet.getRange("B:B").getCell(row, 1).getValue());
    report = SpreadsheetApp.openByUrl(timesheet.getRange("D:D").getCell(row, 1).getValue());
    activeRow = row;
  }
  
  if(dialog1.customTitle) {
    dialog1.title = dialog1.customTitle;
  } else {
    dialog1.title = startDate + ' - ' + endDate + ' ' + dialog1.title;
  }
  
  var result = ui.alert(
    dialog1.title,
    dialog1.subText,
    ui.ButtonSet.YES_NO_CANCEL);
  
  if(result == ui.Button.YES) {
    callback(report, activeRow, ui);
  }
  
  if(result == ui.Button.NO) {
    postResponseDialog(ui, timesheet, dialog2, callback);
  }
}

function postResponseDialog(ui, timesheet, dialog2, callback) {
  var result = ui.prompt(
      dialog2.title,
      dialog2.subText,
       ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var response = result.getResponseText();
  
  if(button == ui.Button.OK) {
    var startDate, endDate, report, i = 0;
    var responseSheet = SpreadsheetApp.openByUrl(response);
    var responses = timesheet.getRange('D:D').getValues();
    
    if(responseSheet) {
      responses.forEach(function (row) {
        var nR = i + 1;
        if(row == response) {
          report = SpreadsheetApp.openByUrl(timesheet.getRange('D:D').getCell(nR, 1).getValue());
          startDate = formatDate(timesheet.getRange('A:A').getCell(nR, 1).getValue());
          endDate = formatDate(timesheet.getRange('B:B').getCell(nR, 1).getValue());
        }
        i++;
      });
      
      callback(report);
    } else {
      ui.alert('You have entered an invalid response link');
    }
  }
}

// =========================================================================
// DIALOG TO SEND INFO TO SLACK
// =========================================================================
function toolbarSlackFormLink() {
  var ui = SpreadsheetApp.getUi();
  var active = SpreadsheetApp.getActiveSheet().getActiveRange();
  var sheet = getSheet();
  var timesheet = sheet.getSheetByName("Time Period");
  var form, startDate, endDate;
  
  if(active.getColumn() == 3 && SpreadsheetApp.getActiveSheet().getName() == 'Time Period' && active.getValue() != '') {
    form = active.getValue();
    startDate = formatDate(timesheet.getRange("A:A").getCell(active.getRow(), 1).getValue());
    endDate = formatDate(timesheet.getRange("B:B").getCell(active.getRow(), 1).getValue());
  } else {
    var row = getLastRow(timesheet);
    form = timesheet.getRange("C:C").getCell(row, 1).getValue(); 
    startDate = formatDate(timesheet.getRange("A:A").getCell(row, 1).getValue());
    endDate = formatDate(timesheet.getRange("B:B").getCell(row, 1).getValue());
  }
  
  var result = ui.alert(
    'Slack ' + startDate + ' - ' + endDate + ' Form?',
    'This will be send to #priv-consensys-member or click no to enter form link manually.',
    ui.ButtonSet.YES_NO_CANCEL);
  
  if(result == ui.Button.YES) {
    postForm(startDate, endDate, form);
  }
  
  if(result == ui.Button.NO) {
    postSlackLink(ui, timesheet);
  }
}

function postSlackLink(ui, timesheet) {
  var result = ui.prompt(
      'Enter the Form Link to send',
      'Please enter the form link to Slack to #priv-consensys-member:',
       ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var form = result.getResponseText();
  
  if(button == ui.Button.OK) {
    var startDate, endDate, report, i = 0;
    var formSheet = SpreadsheetApp.openByUrl(form);
    var forms = timesheet.getRange('C:C').getValues();
    
    if(formSheet) {
      forms.forEach(function (row) {
        var nR = i + 1;
        if(row == form) {
          startDate = formatDate(timesheet.getRange('A:A').getCell(nR, 1).getValue());
          endDate = formatDate(timesheet.getRange('B:B').getCell(nR, 1).getValue());
        }
        i++;
      });
      
      postForm(startDate, endDate, form);
    } else {
      ui.alert('You have entered an invalid form link');
    }
  }
}

//IF USING TESTING FORM 
function testFormDialog() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('You are using the test form. Please change this and try again.');
}