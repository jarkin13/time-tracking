// =========================================================================
// ADD TEAM REPORT - MENU ITEM FUNCTION
// =========================================================================
function generateTeamReport() {
  var dialog1 = {
    'title': 'Response Form',
    'customTitle': false,
    'subText': 'Would you like to generate a team report?'
  };
  
  var dialog2 = {
    'title': 'Enter Time Tracking Response Link',
    'subText': 'Please enter the response link to generate team report:'
  };
  
  reportDialog(dialog1, createTeamReport, dialog2);
}

// =========================================================================
// CREATE TEAM REPORT - DIALOG CALLS FUNCTION
// =========================================================================
function createTeamReport(report) {
  if(!report.getSheetByName('Team Details')) {
    report.insertSheet('Team Details', 2);
  } else {
    getTeamDetails(report).clear();
  }
   
  getTeamDetails(report).getRange('A:A').getCell(1, 1).setValue('Projects').setFontWeight('bold');
  getTeamDetails(report).getRange('B:B').getCell(1, 1).setValue('Total Members').setFontWeight('bold');
  getTeamDetails(report).getRange('C:C').getCell(1, 1).setValue('Total Percentage').setFontWeight('bold');
  var values = getTeamValues(report);

  var nR = 1, nC;
  for(i in values) {
    if(values[i].category != 'TimeOff' && values[i].category != 'New Project') {
      nR++;
      getTeamDetails(report).getRange('A:A').getCell(nR, 1).setValue(values[i].project);
      getTeamDetails(report).getRange('B:B').getCell(nR, 1).setValue(values[i].total);
      getTeamDetails(report).getRange('C:C').getCell(nR, 1).setValue(values[i].percentage);
      for(var v = 0; v < values[i].total; v++) {
        nC = getNextColumn(getTeamDetails(report), nR);
        if(values[i].details[v].fullName) {
          getTeamDetails(report).getRange(nR, nC).setValue(values[i].details[v].fullName);
        } else {
          getTeamDetails(report).getRange(nR, nC).setValue(values[i].details[v].employee);
        } 
        var nCC = nC + 1;
        getTeamDetails(report).getRange(nR, nCC).setValue(values[i].details[v].time);
      }
    } else if(values[i].category != 'TimeOff') {
      nR++;
      getTeamDetails(report).getRange('A:A').getCell(nR, 1).setValue(values[i].project).setFontColor('green');
      getTeamDetails(report).getRange('B:B').getCell(nR, 1).setValue(values[i].total).setFontColor('green');
      getTeamDetails(report).getRange('C:C').getCell(nR, 1).setValue(values[i].percentage).setFontColor('green');
      for(var v = 0; v < values[i].total; v++) {
        nC = getNextColumn(getTeamDetails(report), nR);
        if(values[i].details[v].fullName) {
          getTeamDetails(report).getRange(nR, nC).setValue(values[i].details[v].fullName).setFontColor('green');
        } else {
          getTeamDetails(report).getRange(nR, nC).setValue(values[i].details[v].employee).setFontColor('green');
        } 
        var nCC = nC + 1;
        getTeamDetails(report).getRange(nR, nCC).setValue(values[i].details[v].time).setFontColor('green');
      }
    } else {
      nR++;
      getTeamDetails(report).getRange('A:A').getCell(nR, 1).setValue(values[i].project).setFontColor('blue');
      getTeamDetails(report).getRange('B:B').getCell(nR, 1).setValue(values[i].total).setFontColor('blue');
      getTeamDetails(report).getRange('C:C').getCell(nR, 1).setValue(values[i].percentage).setFontColor('blue');
      for(var v = 0; v < values[i].total; v++) {
        nC = getNextColumn(getTeamDetails(report), nR);
        if(values[i].details[v].fullName) {
          getTeamDetails(report).getRange(nR, nC).setValue(values[i].details[v].fullName).setFontColor('blue');
        } else {
          getTeamDetails(report).getRange(nR, nC).setValue(values[i].details[v].employee).setFontColor('blue');
        } 
        var nCC = nC + 1;
        getTeamDetails(report).getRange(nR, nCC).setValue(values[i].details[v].time).setFontColor('blue');
      }
    }
  }
  
  createEnterpriseReport(report);
}

// =========================================================================
// GET TEAM REPORT VALUES
// =========================================================================
function getTeamValues(report) {
  var projects = projectData();
  var employeeTime = employeeTimeData(report);
  
  addNewProjects(employeeTime, projects);

  for(var i = 0; i < projects.length; i++) {
    projects[i].details = [];
    projects[i].total = 0;
    projects[i].percentage = 0;
    
    var t = 0;
    while(t < employeeTime.length) {
      var employeeProjects = employeeTime[t].projects;
      employeeProjects.forEach(function (project, index) {
        if(project.project == projects[i].project) {
          projects[i].details[projects[i].total] = {
            'employee': employeeTime[t].email,
            'fullName': employeeTime[t].fullName,
            'time': project.percentage
          }
          projects[i].total = projects[i].total + 1;
          projects[i].percentage = projects[i].percentage + project.percentage;
        }
      });
      t++;
    }
  }
  
  addTimeOff(employeeTime, projects);
  
  return projects;
}

function addNewProjects(employeeTime, projects) {
  var t = 0, n = 0, newProjects = [];
  while(t < employeeTime.length) {
    var employeeProjects = employeeTime[t].projects;
    employeeProjects.forEach(function (project, index) {
      if(project.newProject) {
        newProjects[n] = project.project;
        n++;
      }
    });
    t++;
  }
  
  newProjects = newProjects.filter(function(item, pos) {
    return newProjects.indexOf(item) == pos;
  });
  
  var total = projects.length;
  for(var i = 0; i < newProjects.length; i++) {
    projects[total] = {
      'project': newProjects[i],
      'category': 'New Project',
      'details': [],
      'total': 0,
      'percentage': 0
    }
    total++;
  }
}

function addTimeOff(employeeTime, values) {
  for(var i = 0; i < employeeTime.length; i++) {
    if(employeeTime[i].timeOff.total > 0) {
      var v = 0;
      while(v < values.length) {
        if(values[v].project == 'Personal and Vacation') {
          if(employeeTime[i].timeOff.vacationPersonalTime > 0) {
            values[v].details[values[v].total] = {
              'employee': employeeTime[i].email,
              'fullName': employeeTime[i].fullName,
              'time': employeeTime[i].timeOff.vacationPersonalTime
            }
            values[v].total = values[v].total + 1;
            values[v].percentage = values[v].percentage + employeeTime[i].timeOff.vacationPersonalTime;
          }
        }
        
        if(values[v].project == 'National Holiday') {
          if(employeeTime[i].timeOff.nationalHoliday > 0) {
            values[v].details[values[v].total] = {
              'employee': employeeTime[i].email,
              'fullName': employeeTime[i].fullName,
              'time': employeeTime[i].timeOff.nationalHoliday
            }
            values[v].total = values[v].total + 1;
            values[v].percentage = values[v].percentage + employeeTime[i].timeOff.nationalHoliday;
          }
        }
        v++;
      }
    }
  };
}