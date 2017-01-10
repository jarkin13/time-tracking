// =========================================================================
// REMIND MISSING EMPLOYEES - MENU ITEM FUNCTION
// =========================================================================
function sendReminder() {
  var ui = SpreadsheetApp.getUi();
  var active = SpreadsheetApp.getActiveSheet().getActiveRange();
  var sheet = getSheet();
  var timesheet = sheet.getSheetByName("Time Period");
  var report, form, startDate, endDate;
  
  if(active.getColumn() == 3 && SpreadsheetApp.getActiveSheet().getName() == 'Time Period' && active.getValue() != '') {
    form = active.getValue();
    report = SpreadsheetApp.openByUrl(timesheet.getRange("D:D").getCell(active.getRow(), 1).getValue());
    startDate = formatDate(timesheet.getRange("A:A").getCell(active.getRow(), 1).getValue());
    endDate = formatDate(timesheet.getRange("B:B").getCell(active.getRow(), 1).getValue());
  } else {
    var row = getNextRow(timesheet);
    form = timesheet.getRange("C:C").getCell(row, 1).getValue(); 
    startDate = formatDate(timesheet.getRange("A:A").getCell(row, 1).getValue());
    endDate = formatDate(timesheet.getRange("B:B").getCell(row, 1).getValue());
    report = SpreadsheetApp.openByUrl(timesheet.getRange("D:D").getCell(row, 1).getValue());
  }
  
  var result = ui.alert(
    startDate + ' - ' + endDate + ' Form',
    'Send slack message to missing users from this form?',
    ui.ButtonSet.YES_NO_CANCEL);
  
  var values = getMissingValues(report);
  var remindMissing = [];
  
  for(i in values) {
    if(values[i].slack && !values.company) {
      var m = {
        'slack': values[i].slack,
        'email': values[i].email,
        'fullName': values[i].fullName
      };
      remindMissing.push(m);
    }
  }
  
  if(result == ui.Button.YES) {
    reminderMessage(remindMissing, form, startDate, endDate, ui);
  }
  
  if(result == ui.Button.NO) {
    postSlackLink(ui, timesheet);
  }
}

function postSlackLink(ui, timesheet) {
  var result = ui.prompt(
      'Enter Time Tracking Form Link',
      'Please enter the form link to send to missing users:',
       ui.ButtonSet.OK_CANCEL);
  
  var button = result.getSelectedButton();
  var form = result.getResponseText();
  
  if(button == ui.Button.OK) {
    var formSheet = FormApp.openByUrl(form);
    var forms = timesheet.getRange('C:C').getValues();
    var startDate, endDate, report, i = 0;
    
    if(formSheet) {
      forms.forEach(function (row) {
        var nR = i + 1;
        if(row == form) {
          report = SpreadsheetApp.openByUrl(timesheet.getRange('D:D').getCell(nR, 1).getValue());
          startDate = formatDate(timesheet.getRange('A:A').getCell(nR, 1).getValue());
          endDate = formatDate(timesheet.getRange('B:B').getCell(nR, 1).getValue());
        }
        i++;
      });
      
      var missing = getMissingValues(report);
      reminderMessage(missing, form, startDate, endDate, ui);
    } else {
      ui.alert('You have entered an invalid form link');
    }
  }
}