function setBasicVars() {
  playerPos = [0, 0];
}
sTimeArr = [];
eTimeArr = [];
interArr = [];
function startLevel(map) {
  sTimeArr = [];
  eTimeArr = [];
  interArr = [];
  loopArr = [];
  for (var i = 0; i < map.map.action.length; i++) {
    sTimeArr.push(0);
    eTimeArr.push(0);
    interArr.push(0);
    loopArr.push(0);
  }
  for (var i = 0; i < map.map.action.length; i++) {
    startOut(map, i);
    clearInter(map, i);
  }
}
function startOut(map, num) {
  sTimeArr[num] = setTimeout( function () {
    startInter(map, num);
  }, map.map.action[num].startTime[1]*1000);
}
function startInter(map, num) {
  interArr[num] = setInterval( function () {
    loopArr[num]++;
    for (var i = 0; i < map.map.action[0].action.length; i++) {
      var focusVar = map.map.action[0].action[i];
      switch (focusVar.actionType) {
        case 0:
        var tType = [];
        var thisAttr = {};
        for (const j in focusVar.type) {
          if (Math.random() < focusVar.type[j][0]) {
            tType.push(Number(j))
          }
          for (const k in focusVar.type[j][1]) {
            thisAttr[k] = focusVar.type[j][1][k];
          }
        }
        var thisSize = ((focusVar.size[0] == 1) ? randRange(focusVar.size[1], focusVar.size[2]) : focusVar.size[1]);
        var thisPosition = ((focusVar.position[0] == 1) ? 'r' + focusVar.position[1] : [focusVar.position[1], focusVar.position[2]]);
        var thisSpeed = ((focusVar.speed[0] == 1) ? randRange(focusVar.speed[1], focusVar.speed[2]) : focusVar.speed[1]);
        var thisDeg = ((focusVar.deg[0] == 1) ? randRange(focusVar.deg[1], focusVar.deg[2]) : focusVar.deg[1]);
        var thisDisappear = ((focusVar.disappear[0] == 1) ? randRange(focusVar.disappear[1], focusVar.disappear[2]) : focusVar.disappear[1]);
        makeParticle(tType, thisSize, thisPosition, thisSpeed, thisDeg, thisDisappear, thisDisappear, thisAttr);
          break;
      }
    }
  }, map.map.action[num].interval[1]);
}
function clearInter(map, num) {
  eTimeArr[num] = setTimeout( function () {
    clearInterval(interArr[num])
  }, map.map.action[num].endTime[1]*1000+10);
}
function endInterval(map) {
  for (var i = 0; i < map.map.action.length; i++) {
    clearInterval(interArr[i]);
    clearTimeout(sTimeArr[i]);
    clearTimeout(eTimeArr[i]);
  }
}
