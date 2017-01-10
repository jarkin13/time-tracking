// =========================================================================
// ADD ENTERPRISE REPORT - MENU ITEM FUNCTION
// =========================================================================
function generateEnterpriseReport() {
  var dialog1 = {
    'title': 'Response Form',
    'customTitle': false,
    'subText': 'Would you like to generate a enterprise report?'
  };
  
  var dialog2 = {
    'title': 'Enter Time Tracking Response Link',
    'subText': 'Please enter the response link to generate enterprise report:'
  };
  
  reportDialog(dialog1, createEnterpriseReport, dialog2);
}

//ENTERPRISE REPORT is also called in dialog in team report.gs

// =========================================================================
// CREATE ENTERPRISE REPORT - DIALOG CALLS FUNCTION
// =========================================================================
function createEnterpriseReport(report) {
  if(!report.getSheetByName('Enterprise Report')) {
    report.insertSheet('Enterprise Report', 2);
  } else {
    getEnterpriseReport(report).clear();
  }
   
  getEnterpriseReport(report).getRange('A:A').getCell(1, 1).setValue('Projects').setFontWeight('bold');
  getEnterpriseReport(report).getRange('B:B').getCell(1, 1).setValue('Total Members').setFontWeight('bold');
  getEnterpriseReport(report).getRange('C:C').getCell(1, 1).setValue('Total Hours').setFontWeight('bold');
  var values = getEnterpriseValues(report);
  
  var nR = 1, nC;
  for(i in values) {
    nR++;
    getEnterpriseReport(report).getRange('A:A').getCell(nR, 1).setValue(values[i].project);
    getEnterpriseReport(report).getRange('B:B').getCell(nR, 1).setValue(values[i].total);
    getEnterpriseReport(report).getRange('C:C').getCell(nR, 1).setValue(values[i].hours);
    for(var v = 0; v < values[i].total; v++) {
      nC = getNextColumn(getEnterpriseReport(report), nR);
      if(values[i].details[v].fullName) {
        getEnterpriseReport(report).getRange(nR, nC).setValue(values[i].details[v].fullName);
      } else {
        getEnterpriseReport(report).getRange(nR, nC).setValue(values[i].details[v].email);
      }
      var nCC = nC + 1;
      getEnterpriseReport(report).getRange(nR, nCC).setValue(values[i].details[v].time);
    }
  }
}

// =========================================================================
// GET ENTERPRISE REPORT VALUES
// =========================================================================
function getEnterpriseValues(report) {
  var enterpriseProjects = enterpriseProjectData();
  var employeeTime = employeeTimeData(report);

  for(var i = 0; i < enterpriseProjects.length; i++) {
    enterpriseProjects[i].details = [];
    enterpriseProjects[i].total = 0;
    enterpriseProjects[i].hours = 0;
    
    var t = 0;
    while(t < employeeTime.length) {
      var clientProjects = employeeTime[t].clientProjects;
      clientProjects.forEach(function (project, index) {
        if(project.project == enterpriseProjects[i].project) {
          enterpriseProjects[i].details[enterpriseProjects[i].total] = {
            'email': employeeTime[t].email,
            'fullName': employeeTime[t].fullName,
            'time': project.hours
          }
          enterpriseProjects[i].total = enterpriseProjects[i].total + 1;
          enterpriseProjects[i].hours = enterpriseProjects[i].hours + project.hours;
        }
      });
      t++;
    }
  }

  return enterpriseProjects;
}