function generateSalariesSheet() {
  var report = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/152NiCCsIdYBPXKOPlkBpG50BGnABJdMbMfiV3Mli_Vk/edit#gid=1214663134');
  var employees = getEmployees().getRange('A:A').getValues();
  var lR = getNextRow(getEmployees());

  if(!getSalaries(report)) {
    report.insertSheet('Salaries', 3);
    var salaries = getSalaries(report);
    salaries.getRange(1, 1).setValue('Employee');
    salaries.getRange(1, 2).setValue('Salary');
    
    var nR = 1;
    for(var i = 0; i < lR; i++) {
      if(i != 0) {
        nR++;
        salaries.getRange('A:A').getCell(nR, 1).setValue(employees[i]);
      }
    }
  }
}
