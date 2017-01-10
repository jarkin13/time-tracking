// =========================================================================
// GENERATE FEEDBACK REPORT - MENU ITEM FUNCTION
// =========================================================================
function generateFeedbackReport() {
  var dialog1 = {
    'title': 'Response Form',
    'customTitle': false,
    'subText': 'Would you like to generate a feedback report?'
  };
  
  var dialog2 = {
    'title': 'Enter Time Tracking Response Link',
    'subText': 'Please enter the response link to generate feedback report:' 
  };
  
  reportDialog(dialog1, createFeedbackReport, dialog2);
}

// =========================================================================
// CREATE TIME REPORT - DIALOG CALLS THIS
// =========================================================================
function createFeedbackReport(report) {
  if(!report.getSheetByName('Employee Feedback')) {
    report.insertSheet('Employee Feedback', 2);
  } else {
    getFeedbackReport(report).clear();
  }  
  
  getFeedbackReport(report).getRange('A:A').getCell(1, 1).setValue('Employee').setFontWeight('bold');
  getFeedbackReport(report).getRange('B:B').getCell(1, 1).setValue('Feedback').setFontWeight('bold');
  
  var employee = employeeTimeData(report);
  var row = 1; 
  
  for(var i = 0; i < employee.length; i++) {
    row++;
    getFeedbackReport(report).getRange('A:A').getCell(row, 1).setValue(employee[i].fullName);
    getFeedbackReport(report).getRange('B:B').getCell(row, 1).setValue(employee[i].feedback);
  }
}