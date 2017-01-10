//PROD
//function getEnvironment() {
  //return 'Production';
//}

//STAG
//function getEnvironment() {
  //return 'Staging';
//}

//TESTING
function getEnvironment() {
  return 'Testing';
}

function getSourceOfTruth() {
  var env = getEnvironment();
  
  if(env == 'Production') {
    return SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1Gxexsx6VCoY6aI3uqlP1fMf0YdwKJ_LecAruQ8p4yoM/edit#gid=252329516');
  } else if(env =='Staging') {
    return SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/u/2/d/1Ks-gGRzLisdfh4xVXB5ixgsTCj-_RAoB8BYzH9FVSvE/edit?usp=drive_web');
  } else {
    return SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1XMXXY2GhwlYWBFKarh0w6d4SHN0UgboHTQthHOH5Qo4/edit#gid=252329516');
  }
}

function getSheet() {
  var env = getEnvironment();
  
  if(env == 'Production') {
    return SpreadsheetApp.openById('1Gxexsx6VCoY6aI3uqlP1fMf0YdwKJ_LecAruQ8p4yoM');
  } else if(env =='Staging') {
    return SpreadsheetApp.openById('1Cl1fhmbOXMNmvaeHTZD4e5MsUCH-JdW0ndnlzTjmf1c');
  } else {
    return SpreadsheetApp.openById('1XMXXY2GhwlYWBFKarh0w6d4SHN0UgboHTQthHOH5Qo4');
  }
}

function getFolder() {
  var env = getEnvironment();
  
  if(env == 'Production') {
    return DriveApp.getFolderById('0B4YjxQcvg8ZuSVpwUVFDTmNLTFE');
  } else if(env =='Staging') {
    return DriveApp.getFolderById('0B4YjxQcvg8ZuUWlXS0pzcGxsTDA');
  } else {
    return DriveApp.getFolderById('0B4YjxQcvg8ZueVI5VkFmQi1FQlU');
  }
}

function getFormDrive() {
  var env = getEnvironment();
  
  if(env == 'Production') {
    return DriveApp.getFileById('1TmSiWWyd9qNWHhFomhcboKVEJ0A4KFbVyX0bg3PApdw');
  } else if(env =='Staging') {
    return DriveApp.getFileById('1VA1igbMGjCKBrGpMBj-ZnOk46q3d5OgWG-ikkeOiwlM');
  } else {
    return DriveApp.getFileById('1eUkItmrz4XKJw1QjOURC5ys5U-hlD6uPAvQvi_hIrZY');
  }
}

//GLOBAL
function getTestResponse() {
  var env = getEnvironment();
  
  if(env == 'Production') {
    testFormDialog();
    return false;
  } else if(env == 'Staging') {
    return SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/152NiCCsIdYBPXKOPlkBpG50BGnABJdMbMfiV3Mli_Vk/edit#gid=1214663134');
  } else {
    return SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1bjgnWtG5tRrrMngPh0YoMRx9zapvNEq2_xo3BoJ6X_M/edit#gid=1074588745');
  }
}