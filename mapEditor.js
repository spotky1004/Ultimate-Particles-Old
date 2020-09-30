mapData = {};
actionToolNow = -1;
focusActionNum = -1;
focusAChildNum = -1;
focusParcicle = 0;

function enterEditor() {
  document.querySelector('body > div').style.display = 'none';
  document.querySelector('#mapEditor').style.display = 'block';
}

//system function
function openTextFile() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt, .json";
    input.onchange = function (event) {
      processFile(event.target.files[0]);
    };
    input.click();
}
function processFile(file) {
  var reader = new FileReader();
  reader.onload = function () {
    try {
      mapData = String(reader.result)
      mapData = JSON.parse(mapData);
      loadMap();
    } catch (e) {
      console.log(e);
    }
  };
  reader.readAsText(file, /* optional */ "euc-kr");
}
function appendShort(type, className, parentNode, nth=-1) {
  //parentNode = parentNode.replace(/:nth-child\((\w+)\)/g, ':nth-child($1)');
  var cNode = document.createElement(type);
  if (className != '') {
    cNode.classList.add(className);
  }
  if (nth == -1) {
    var pNode = document.querySelector(parentNode);
  } else {
    var pNode = document.querySelectorAll(parentNode)[nth];
  }
  pNode.appendChild(cNode);
}
function innerWrite(selector, txt) {
  //selector = selector.replace(/:nth-child\((\w+)\)/g, `:nth-child($1)`);
  document.querySelector(selector).innerHTML = txt;
}
function cutNumber(num, min, max, fix=0) {
  if (!isNaN(num)) {
    num = Number(Number(num).toFixed(fix));
    if (num < min) num = min;
    if (num > max) num = max;
    return num;
  } else {
    return 0;
  }
}
function download(filename, text) {
  if (focusAChildNum != -1) {
    exitChildAction();
  }
  if (focusActionNum != -1) {
    exitActionEdit();
  }
  saveGlobalAction();
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  if (document.createEvent) {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

//init function
function loadMap() {
  try {
    fillMapJSON();
  } catch (e) {
    console.log(e);
    return;
  }
  //change screen
  document.querySelector('#mapName').innerHTML = mapData.name;
  document.querySelector('#editorHeader').style.display = 'none';
  document.querySelector('#fileMenu').style.display = 'none';
  document.querySelector('#editorScreen').style.display = 'block';
  //change game area to here
  document.querySelector('#gameArea').id = 'tempGameAreaa';
  document.querySelector('#tempGameArea').id = 'gameArea';
  document.querySelector('#tempGameAreaa').id = 'tempGameArea';
  canvas = document.querySelector('#gameArea');
  c = canvas.getContext('2d');
  //set var
  editing = 1;
  actionTool(-1);
  actionPage = 0;
}
function exitEditor() {
  document.querySelector('#editorHeader').style.display = 'block';
  document.querySelector('#fileMenu').style.display = 'block';
  document.querySelector('#editorScreen').style.display = 'none';
  if (focusAChildNum != -1) {
    exitChildAction();
  }
  if (focusActionNum != -1) {
    exitActionEdit();
  }
  actionToolNow = -1;
  actionPage = 0;
  editing = 0;
  //change game area to here
  document.querySelector('#gameArea').id = 'tempGameAreaa';
  document.querySelector('#tempGameArea').id = 'gameArea';
  document.querySelector('#tempGameAreaa').id = 'tempGameArea';
  canvas = document.querySelector('#gameArea');
  c = canvas.getContext('2d');
}
function enterEditor() {
  document.querySelector('#mainScreen').style.display = 'none';
  document.querySelector('#editorHeader').style.display = 'block';
  document.querySelector('#mapEditor').style.display = 'block';
}
function exitFileload() {
  document.querySelector('#mainScreen').style.display = 'block';
  document.querySelector('#editorHeader').style.display = 'none';
  document.querySelector('#mapEditor').style.display = 'none';
}
function enterActionEdit(num) {
  if (actionToolNow == -1) {
    document.querySelector('#actionContainer').style.display = 'none';
    document.querySelector('#actionEdit').style.display = 'block';
    document.querySelector('#actionTopNav').style.display = 'none';
    focusActionNum = num-1;
    actionTool(-1);
    updateActionEdit(num);
    updateChildAction();
  } else if (actionToolNow == 0) {
    mapData.map.action.push(JSON.parse(JSON.stringify(mapData.map.action[num-1])));
    updateActionTab();
  } else {
    mapData.map.action.splice(num-1, 1);
    if (actionPage > Math.max(Math.floor((mapData.map.action.length-1)/5), 0)) {
      actionPage = Math.max(Math.floor((mapData.map.action.length-1)/5), 0);
    }
    updateActionTab();
  }
}
function exitActionEdit() {
  //save
  mapData.map.action[focusActionNum].startTime[1] = cutNumber(document.querySelector('#actionGlobal > div:nth-child(1) > span:nth-child(3)').innerHTML, 0, 999, 1);
  mapData.map.action[focusActionNum].endTime[1] = cutNumber(document.querySelector('#actionGlobal > div:nth-child(2) > span:nth-child(3)').innerHTML, mapData.map.action[focusActionNum].startTime[1], 999, 1);
  mapData.map.action[focusActionNum].interval[1] = cutNumber(document.querySelector('#actionGlobal > div:nth-child(3) > span:nth-child(3)').innerHTML, 1, 9999);
  //exit
  document.querySelector('#actionContainer').style.display = 'block';
  document.querySelector('#actionEdit').style.display = 'none';
  document.querySelector('#actionTopNav').style.display = 'block';
  focusActionNum = -1;
  actionTool(-1);
  //update
  updateActionTab();
}
function editChildAction(num, num2) {
  if (actionToolNow == -1) {
    focusParcicle = 0;
    focusActionNum = num2;
    focusAChildNum = num;
    document.querySelector('#actionChildEdit').style.display = 'block';
    document.querySelector('#actionChildEdit > div').style.display = 'none';
    document.querySelector('#actionChildEdit > div:nth-child(' + (mapData.map.action[focusActionNum].action[focusAChildNum].actionType+1) + ')').style.display = 'block';
    document.querySelector('#actionContainer').style.display = 'none';
    document.querySelector('#actionTopNav').style.display = 'none';
    setTimeout( function () {
      document.querySelector('#actionEdit').style.display = 'none';
    }, 0);
    switch (mapData.map.action[focusActionNum].action[focusAChildNum].actionType) {
      case 0:
      updateParticleEdit();
        break;
    }
  }
}
function exitChildAction() {
  var focusVar = mapData.map.action[focusActionNum].action[focusAChildNum];
  try {
    switch (focusVar.actionType) {
      case 0:
      saveParticle();
        break;
    }
  } catch (e) {

  }
  focusAChildNum = -1;
  document.querySelector('#actionChildEdit').style.display = 'none';
  document.querySelector('#actionChildEdit > div').style.display = 'none';
  document.querySelector('#actionContainer').style.display = 'none';
  document.querySelector('#actionEdit').style.display = 'block';
  updateChildAction();
}
function updateEditorPlay() {
  if (tempFlag) {
    document.querySelector('#editorController').innerHTML = 'Stop';
    document.querySelector('#editorController').style.filter = 'hue-rotate(-110deg)';
    startLevel(mapData);
  } else {
    document.querySelector('#editorController').innerHTML = 'Start';
    document.querySelector('#editorController').style.filter = 'hue-rotate(0deg)';
    destoryParticle(1, 0);
  }
}
function saveGlobalAction() {

}

//json
function fillMapJSON() {
  toFill = [
    'name', 'golbalSpeed', 'backgroundCol', 'musicSrc', 'map'
  ];
  toFillData = [
    'mapName', 1, '#f2c633', '../sounds/lv1.wav', {}
  ];
  for (var i = 0; i < toFill.length; i++) {
    if (mapData[toFill[i]] === undefined) {
      mapData[toFill[i]] = toFillData[i];
    }
  }
  toFill = [
    'action'
  ];
  toFillData = [
    []
  ];
  for (var i = 0; i < toFill.length; i++) {
    if (mapData.map[toFill[i]] === undefined) {
      mapData.map[toFill[i]] = toFillData[i];
    }
  }
}

//loop
function textboxHandle() {
  mapData.name = document.querySelector('#mapName').innerHTML;
}

//update DOM
function updateActionTab() {
  document.querySelector('#actionContainer').innerHTML = '';
  for (var i = actionPage*5; i < Math.min(mapData.map.action.length, 5+actionPage*5); i++) {
    appendShort('div', 'actionBox', '#actionContainer');
    document.querySelector('#actionContainer > .actionBox:nth-child(' + (i%5+1) + ')').onclick = new Function('enterActionEdit(' + (i+1) + ')');
    for (var j = 0; j < 2; j++) {
      appendShort('span', '', '.actionBox', i%5);
    }
    for (var j = 0; j < 2; j++) {
      appendShort('div', '', '#actionContainer > .actionBox:nth-child(' + (i%5+1) + ') > span:nth-child(1)');
    }
    innerWrite('#actionContainer > .actionBox:nth-child(' + (i%5+1) + ') > span:nth-child(1) > div:nth-child(1)', mapData.map.action[i].startTime[1] + '<span class="miniTxt">s</span> ~ ' + mapData.map.action[i].endTime[1] + '<span class="miniTxt">s</span>');
    innerWrite('#actionContainer > .actionBox:nth-child(' + (i%5+1) + ') > span:nth-child(1) > div:nth-child(2)', mapData.map.action[i].interval[1] + '<span class="miniTxt">ms</span>');
    updateChildActionAt('#actionContainer > .actionBox:nth-child(' + (i%5+1) + ') > span:nth-child(2)', i, 0);
  }
  innerWrite('#actionPageNow', actionPage+1);
  innerWrite('#actionPageMax', Math.max(Math.floor((mapData.map.action.length-1)/5)+1, 1));
}
function updateActionEdit(num) {
  num--;
  for (var i = 0; i < 3; i++) {
    argStr = '';
    switch (i) {
      case 0:
      argStr = 'startTime';
        break;
      case 1:
      argStr = 'endTime';
        break;
      case 2:
      argStr = 'interval';
        break;
    }
    document.querySelector('#ai0-' + i + '-1').style.display = (mapData.map.action[num][argStr][0] ? 'block' : 'none');
    if (i != 2) {
      document.querySelector('#actionGlobal > div:nth-child(' + (i+1) + ') > span:nth-child(4)').innerHTML =  (mapData.map.action[num][argStr][0] ? 's ~' : 's');
    } else {
      document.querySelector('#actionGlobal > div:nth-child(' + (i+1) + ') > span:nth-child(4)').innerHTML =  (mapData.map.action[num][argStr][0] ? 'ms ~' : 'ms');
    }
    document.querySelector('#actionGlobal > div:nth-child(' + (i+1) + ') > span:nth-child(6)').style.display =  (mapData.map.action[num][argStr][0] ? 'block' : 'none');
    document.querySelector('#actionGlobal > div:nth-child(' + (i+1) + ') > span:nth-child(3)').innerHTML =  mapData.map.action[num][argStr][1];
    document.querySelector('#actionGlobal > div:nth-child(' + (i+1) + ') > span:nth-child(5)').innerHTML =  (mapData.map.action[num][argStr][0] ? mapData.map.action[num][argStr][2] : 0);
  }
}
function updateChildAction() {
  document.querySelector('#actionEdit > .actionHeaders:nth-child(4)').innerHTML = 'Action (' + mapData.map.action[focusActionNum].action.length + '/10)';
  updateChildActionAt('#actionList', focusActionNum);
}
function updateChildActionAt(ele, actNum, trash=1) {
  document.querySelector(ele).innerHTML = '';
  for (var i = 0; i < mapData.map.action[actNum].action.length; i++) {
    appendShort('div', 'editorChildAction', ele);
    document.querySelector(ele + ' > .editorChildAction:nth-child(' + (i+1) + ')').onclick = new Function("editChildAction(" + i + "," + actNum + ");");
    if (trash) {
      appendShort('span', 'trashAction', ele + ' > .editorChildAction:nth-child(' + (i+1) + ')');
      document.querySelector(ele + ' > .editorChildAction:nth-child(' + (i+1) + ') > .trashAction').innerHTML = 'Trash';
      document.querySelector(ele + ' > .editorChildAction:nth-child(' + (i+1) + ') > .trashAction').onclick = new Function('deleleChildAction(' + i + ')');
    }
    switch (mapData.map.action[actNum].action[i].actionType) {
      case 0:
      appendShort('span', 'editorParticle', ele + ' > .editorChildAction:nth-child(' + (i+1) + ')');
      eTypes = [];
      for (const j in mapData.map.action[actNum].action[i].type) {
        if (mapData.map.action[actNum].action[i].type[j][0] != 0) {
          eTypes.push(j);
        }
      }
      if (eTypes.length > 1) {
        document.querySelector(ele + ' > .editorChildAction:nth-child(' + (i+1) + ') > .editorParticle').style.backgroundColor = '#fff';
      } else {
        document.querySelector(ele + ' > .editorChildAction:nth-child(' + (i+1) + ') > .editorParticle').style.backgroundColor = '#' + particleData[eTypes[0]].col;
      }
      var shortV = mapData.map.action[actNum].action[i];
      appendShort('span', 'editorEtcData', ele + ' > .editorChildAction:nth-child(' + (i+1) + ')');
      document.querySelector(ele + ' > .editorChildAction:nth-child(' + (i+1) + ') > .editorEtcData').innerHTML = `${shortV.size[1]} ${shortV.position[1]} ${shortV.speed[1]} ${shortV.deg[1]} ${((shortV.disappear[1] != -1) ? shortV.disappear[1] : 'none')}`;
        break;
    }
  }
}
function updateParticleEdit() {
  var eleArr = document.querySelectorAll('#particleActionBox > .addChildAction');
  var focusVar = mapData.map.action[focusActionNum].action[focusAChildNum];
  for (var i = 0; i < eleArr.length; i++) {
    eleArr[i].className = 'addChildAction';
  }
  document.querySelector('#particleActionBox > .addChildAction:nth-child(' + (focusParcicle+1) + ')').className = 'addChildAction selected';
  document.querySelector('#particleHeader').innerHTML = 'Attr - ' + particleData[focusParcicle].name;
  for (var i = 0; i < 5; i++) {
    var attrType = '';
    switch (i) {
      case 0:
      attrType = 'size';
        break;
      case 1:
      attrType = 'position';
        break;
      case 2:
      attrType = 'speed';
        break;
      case 3:
      attrType = 'deg';
        break;
      case 4:
      attrType = 'disappear';
        break;
    }
    document.querySelector('#ai1-' + i + '-0').innerHTML = focusVar[attrType][1];
    document.querySelector('#ai1-' + i + '-1').style.display = ((focusVar[attrType][0] == 1) ? 'block' : 'none');
    document.querySelector('#ai1-' + i + '-1').innerHTML = focusVar[attrType][2];
    document.querySelector('#particleAttr > .actionFormBox:nth-child(' + (i+1) + ') > span:nth-child(2) > div:nth-child(1)').innerHTML = ((focusVar[attrType][0] == 1) ? 'R' : 'N');
    switch (i) {
      case 0:
      document.querySelector('#particleAttr > .actionFormBox:nth-child(1) > span:nth-child(4)').innerHTML = ((focusVar[attrType][0] == 1) ? 'x ~' : 'x');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(1) > span:nth-child(6)').style.display = ((focusVar[attrType][0] == 1) ? 'block' : 'none');
        break;
      case 1:
      document.querySelector('#ai1-' + i + '-1').style.display = ((focusVar[attrType][0] == 1) ? 'none' : 'block');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(2) > span:nth-child(3)').innerHTML = ((focusVar[attrType][0] == 1) ? 'r' : '');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(2) > span:nth-child(5)').style.display = ((focusVar[attrType][0] == 1) ? 'none' : 'block');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(2) > span:nth-child(6)').style.display = ((focusVar[attrType][0] == 1) ? 'none' : 'block');
        break;
      case 2:
      document.querySelector('#particleAttr > .actionFormBox:nth-child(3) > span:nth-child(4)').innerHTML = ((focusVar[attrType][0] == 1) ? 'x ~' : 'x');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(3) > span:nth-child(6)').style.display = ((focusVar[attrType][0] == 1) ? 'block' : 'none');
        break;
      case 3:
      document.querySelector('#particleAttr > .actionFormBox:nth-child(4) > span:nth-child(4)').innerHTML = ((focusVar[attrType][0] == 1) ? '° ~' : '°');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(4) > span:nth-child(6)').style.display = ((focusVar[attrType][0] == 1) ? 'block' : 'none');
        break;
      case 4:
      document.querySelector('#particleAttr > .actionFormBox:nth-child(5) > span:nth-child(4)').innerHTML = ((focusVar[attrType][0] == 1) ? 's ~' : 's');
      document.querySelector('#particleAttr > .actionFormBox:nth-child(5) > span:nth-child(6)').style.display = ((focusVar[attrType][0] == 1) ? 'block' : 'none');
        break;
    }
  }
  document.querySelector('#ai2-0-1').innerHTML = ((focusVar.type[focusParcicle][0]) ? 'Yes' : 'No');
  document.querySelector('#leaserAttr').style.display = ((focusParcicle == 3) ? 'block' : 'none');
  switch (focusParcicle) {
    case 3:
    document.querySelector('#ai3-0-0').innerHTML = focusVar.type[3][1].leaserDecay;
    document.querySelector('#ai3-1-0').innerHTML = focusVar.type[3][1].leaserInterval;
    document.querySelector('#ai3-2-0').innerHTML = focusVar.type[3][1].leaserSpeed;
      break;
  }
}

//DOM onclicks
function editorTab(num) {
  eleArr = document.querySelectorAll('#editorSubTab > div');
  for (var i = 0; i < eleArr.length; i++) {
    eleArr[i].style.display = 'none';
  }
  eleArr[num].style.display = 'block';
  eleArr = document.querySelectorAll('#topNav > span');
  for (var i = 0; i < eleArr.length; i++) {
    eleArr[i].classList = [];
  }
  eleArr[num].classList.add('selectedTab');
}
function actionTool(num) {
  eleArr = document.querySelectorAll('#actionTopNav > span');
  for (var i = 0; i < eleArr.length; i++) {
    eleArr[i].classList = [];
  }
  if (num == actionToolNow) {
    actionToolNow = -1;
  } else {
    actionToolNow = num;
  }
  switch (actionToolNow) {
    case 0:
      eleArr[0].classList.add('selectedTool');
      break;
    case 1:
      eleArr[2].classList.add('selectedTool');
      break;
  }
}
function addAction() {
  mapData.map.action.push({
    'startTime' : [0, 0, 0],
    'endTime' : [0, 0, 0],
    'interval' : [0, 200, 0],
    'action' : []
  });
  updateActionTab();
}
function actionPageMove(num) {
  actionPage += num;
  if (actionPage < 0 || actionPage > Math.floor((mapData.map.action.length-1)/5)) {
    actionPage -= num;
    return;
  }
  updateActionTab();
}
function addChildAction(num) {
  if (mapData.map.action[focusActionNum].action.length < 10) {
    switch (num) {
      case 0:
      mapData.map.action[focusActionNum].action.push({
        'actionType' : 0,
        'type' : {
          0 : [1, {}],
          1 : [0, {}],
          2 : [0, {}],
          3 : [0, {
            "leaserDecay" : 0.5,
            "leaserInterval" : 10,
            "leaserSpeed" : 0.1,
        }]
        },
        'size' : [0, 0.02, 0, 0, 0, 0],
        'position' : [1, 0, 0, 0, 0, 0],
        'speed' : [0, 1, 0, 0, 0, 0],
        'deg' : [0, 0, 0, 0, 0, 0],
        'disappear' : [0, -1, 0, 0, 0]
      });
      //[randomFlag, num or randomMin, randomMax, loopCount, loopAdd]
        break;
      default:

    }
    updateChildAction();
  }
}
function deleleChildAction(num) {
  mapData.map.action[focusActionNum].action.splice(num, 1);
  updateChildAction();
  setTimeout( function () {
    exitChildAction();
    setTimeout( function () {
      document.querySelector('#actionEdit').style.display = 'block';
    }, 0);
  }, 0);
}
function selParticle(num) {
  saveParticle();
  focusParcicle = num;
  //mapData.map.action[focusActionNum].action[focusAChildNum].type = {};
  //mapData.map.action[focusActionNum].action[focusAChildNum].type[num] = 1;
  updateParticleEdit();
}
function switchRand(num) {
  switch (num) {
    case 0:
    mapData.map.action[focusActionNum].action[focusAChildNum].size[0] ^= 1;
    mapData.map.action[focusActionNum].action[focusAChildNum].size[1] = 0.02;
    mapData.map.action[focusActionNum].action[focusAChildNum].size[2] = 0.02;
    updateParticleEdit();
      break;
    case 1:
    mapData.map.action[focusActionNum].action[focusAChildNum].position[0] ^= 1;
    if (mapData.map.action[focusActionNum].action[focusAChildNum].position[0]) {
      mapData.map.action[focusActionNum].action[focusAChildNum].position[1] = 0;
    } else {
      mapData.map.action[focusActionNum].action[focusAChildNum].position[1] = 0;
      mapData.map.action[focusActionNum].action[focusAChildNum].position[2] = 0;
    }
    updateParticleEdit();
      break;
    case 2:
    mapData.map.action[focusActionNum].action[focusAChildNum].speed[0] ^= 1;
    mapData.map.action[focusActionNum].action[focusAChildNum].speed[1] = 1;
    mapData.map.action[focusActionNum].action[focusAChildNum].speed[2] = 1;
    updateParticleEdit();
      break;
    case 3:
    mapData.map.action[focusActionNum].action[focusAChildNum].deg[0] ^= 1;
    mapData.map.action[focusActionNum].action[focusAChildNum].deg[1] = 0;
    mapData.map.action[focusActionNum].action[focusAChildNum].deg[2] = 0;
    updateParticleEdit();
      break;
    case 4:
    mapData.map.action[focusActionNum].action[focusAChildNum].disappear[0] ^= 1;
    mapData.map.action[focusActionNum].action[focusAChildNum].disappear[1] = -1;
    mapData.map.action[focusActionNum].action[focusAChildNum].disappear[2] = -1;
    updateParticleEdit();
      break;
  }
}
function editorPlay() {
  tempFlag ^= 1;
  if (tempFlag == 1) {
    if (focusAChildNum != -1) {
      exitChildAction();
    }
    if (focusActionNum != -1) {
      exitActionEdit();
    }
    saveGlobalAction();
  } else {
    endInterval(mapData);
  }
  updateEditorPlay();
  setTimeout( function () {

  }, 500);
}
function editorFlag(num) {
  saveParticle();
  switch (num) {
    case 0:
    var trueCount = 0;
    for (const i in mapData.map.action[focusActionNum].action[focusAChildNum].type) {
      if (mapData.map.action[focusActionNum].action[focusAChildNum].type[i][0] > 0) {
        trueCount++;
      }
    }
    if (mapData.map.action[focusActionNum].action[focusAChildNum].type[focusParcicle][0] == 0 || trueCount > 1) {
      mapData.map.action[focusActionNum].action[focusAChildNum].type[focusParcicle][0] ^= 1;
    }
    updateParticleEdit();
      break;
    default:

  }
}

//save
function saveParticle() {
  saveParticleGlobal();
  saveParticleAttr();
}
function saveParticleGlobal() {
  var focusVar = mapData.map.action[focusActionNum].action[focusAChildNum];
  focusVar.size[1] = cutNumber(document.querySelector('#ai1-0-0').innerHTML, 0.01, 1, 3);
  focusVar.size[2] = cutNumber(document.querySelector('#ai1-0-1').innerHTML, focusVar.size[1], 1, 3);
  if (focusVar.position[0] == 1) {
    focusVar.position[1] = cutNumber(Math.floor(document.querySelector('#ai1-1-0').innerHTML), 0, 0, 0);
  } else {
    focusVar.position[1] = cutNumber(document.querySelector('#ai1-1-0').innerHTML, -0.99, 0.99, 2);
    focusVar.position[2] = cutNumber(document.querySelector('#ai1-1-1').innerHTML, -0.99, 0.99, 2);
  }
  focusVar.speed[1] = cutNumber(document.querySelector('#ai1-2-0').innerHTML, 0.01, 10, 2);
  focusVar.speed[2] = cutNumber(document.querySelector('#ai1-2-1').innerHTML, focusVar.speed[1], 10, 2);
  focusVar.deg[1] = cutNumber(document.querySelector('#ai1-3-0').innerHTML, 0, 360, 2);
  focusVar.deg[2] = cutNumber(document.querySelector('#ai1-3-1').innerHTML, focusVar.deg[1], 360, 2);
  focusVar.disappear[1] = cutNumber(document.querySelector('#ai1-4-0').innerHTML, -1, 100, 2);
  focusVar.disappear[2] = cutNumber(document.querySelector('#ai1-4-1').innerHTML, focusVar.disappear[1], 100, 2);
}
function saveParticleAttr() {
  var focusVar = mapData.map.action[focusActionNum].action[focusAChildNum].type[focusParcicle][1];
  switch (focusParcicle) {
    case 3:
    focusVar.leaserDecay = cutNumber(document.querySelector('#ai3-0-0').innerHTML, 0, 999, 2);
    focusVar.leaserInterval = cutNumber(document.querySelector('#ai3-1-0').innerHTML, 0, 1000, 0);
    focusVar.leaserSpeed = cutNumber(document.querySelector('#ai3-2-0').innerHTML, 0, 10, 2);
      break;
  }
}
