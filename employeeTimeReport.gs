// =========================================================================
// GENERATE TIME REPORT - MENU ITEM FUNCTION
// =========================================================================
function generateTimeReport() {
  var dialog1 = {
    'title': 'Response Form',
    'customTitle': false,
    'subText': 'Would you like to generate a time report?'
  };
  
  var dialog2 = {
    'title': 'Enter Time Tracking Response Link',
    'subText': 'Please enter the response link to generate time report:' 
  };
  
  reportDialog(dialog1, createTimeReport, dialog2);
}

// =========================================================================
// CREATE TIME REPORT - DIALOG CALLS THIS
// =========================================================================
function createTimeReport(report) {
  if(!report.getSheetByName('Employee Time')) {
    report.insertSheet('Employee Time', 2);
  } else {
    getTimeReport(report).clear();
  }  
  
  getTimeReport(report).getRange('A:A').getCell(1, 1).setValue('Employee').setFontWeight('bold');
  getTimeReport(report).getRange('B:B').getCell(1, 1).setValue('Total Hours').setFontWeight('bold');
  
  var employee = employeeTimeData(report);
  var row = 1; 
  
  for(var i = 0; i < employee.length; i++) {
    row++;
    if(employee[i].percentage != 100) {
      getTimeReport(report).getRange('A:A').getCell(row, 1).setValue(employee[i].fullName).setFontWeight('bold').setFontColor('red');
      getTimeReport(report).getRange('B:B').getCell(row, 1).setValue(employee[i].percentage).setFontWeight('bold').setFontColor('red');
    } else {
      getTimeReport(report).getRange('A:A').getCell(row, 1).setValue(employee[i].fullName);
      getTimeReport(report).getRange('B:B').getCell(row, 1).setValue(employee[i].percentage);
    }
  }
}