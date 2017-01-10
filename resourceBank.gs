function setEmployeesResource() {
  var employeeList = getEmployeesList();
  var lR = getNextRow(getEmployeesList());
  var values = findMissingResourceBank();
  
  employeeList.deleteColumn(9);
  employeeList.insertColumnAfter(8);
  employeeList.getRange('I:I').getCell(1, 1).setValue('Resource Bank').setFontWeight('bold');
  
  var row = 0, missing;
  for(var i = 0; i < lR; i++) {
    if(values[i]) {
      row = values[i].row + 1;
      if(values[i].missing) {
        missing = 'Missing';
      } else {
        missing = 'Completed';
      }
      employeeList.getRange('I:I').getCell(row, 1).setValue(missing);
    }
  }
}

function findMissingResourceBank() {
  var responses = getResourceBank().getRange('B2:B1000').getValues();
  var lastResponse = getNextRow(getResourceBank());
  var employeeEmail = getEmployeesList().getRange('D:D').getValues();
  var lR = getNextRow(getEmployeesList());
  var values = [], row, column, e = 0;
  
  values.total = 0;
  for(var i = 0; i < lR; i++) {
    if(i != 0) {
      values[e] = {
        'email': employeeEmail[i],
        'missing': true,
        'row': i
      }
      values.total = values.total + 1;
      for(var r = 0; r < lastResponse; r++) {
        responses[r].forEach(function (email, index) {
         if(email == employeeEmail[i] && email != '') {
          values[e].missing = false;
          values.total = values.total - 1; 
         };
        });
      }
      e++;
    }
  }
  return values;
}
