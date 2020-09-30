canvas = document.querySelector('#gameArea');
c = canvas.getContext('2d');

playerPos = [0, 0];
playerSize = 0.1;
playerSpeed = 0.8;
enemyArr = [];
boxSize = 1;
tempFlag = 0;
editing = 0;

//basic game function
function getPosition(position) {
  return (position+1)*canvas.width/2;
}
function drawParticle(position, colArr=['000'], size=0.04, opacity=1) {
  for (var i = 0; i < colArr.length; i++) {
    c.fillStyle = '#' + colArr[i];
    c.globalAlpha = opacity;
    c.fillRect(
      getPosition(position[0]-(size/2)+(size/2)*(i/colArr.length*2)*(1/boxSize)), getPosition(position[1]-size/2),
      size/2*screenSize/colArr.length, size/2*screenSize
    );
  }
  c.globalAlpha = 1;
}

//system function
keypress = {};
document.addEventListener('keydown', keyUp);
document.addEventListener('keyup', keyDown);
function keyUp(e) {
  keypress[e.keyCode] = true;
  /* if (!tempFlag && keypress['65']) {
    tempFlag = 1;
    levelA();
  }
  if (!tempFlag) {
    tempFlag = 1;
    level1();
  } */
}
function keyDown(e) {
  keypress[e.keyCode] = false;
}
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
function randRange(min, max) {
  return min+Math.random()*(max-min);
}

//game loop
function setBoxSize() {
  if (!editing) {
    screenSize = Math.min(innerWidth-innerHeight*0.02, innerHeight*0.98);
  } else {
    pereElement = document.querySelector('#editorTest').getBoundingClientRect();
    screenSize = Math.min(pereElement.width-innerHeight*0.02, pereElement.height-innerHeight*0.02);
  }
  canvas.width = screenSize*boxSize;
  canvas.height = screenSize*boxSize;
  if (editing) {
    document.querySelector('#editorTest > #gameArea').style.marginLeft = (pereElement.width-innerHeight*0.02-canvas.width)/2 + 'px';
  }
  document.querySelector('#warpCanvas').style.margin = `${(innerHeight*0.98-screenSize*boxSize)/2}px 0px 0px ${((innerWidth-innerHeight*0.02)-screenSize*boxSize)/2}px`;
}
function drawBox() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.rect(0, 0, canvas.width, canvas.height);
  c.fillStyle = '#f2c633';
  c.fill();
  for (var i = 0; i < enemyArr.length; i++) {
    colArr = [];
    for (var j = 0; j < enemyArr[i][0].length; j++) {
      colArr.push(particleData[enemyArr[i][0][j]].col);
    }
    drawParticle(enemyArr[i][2], colArr, enemyArr[i][1], enemyArr[i][5]/enemyArr[i][6]);
  }
  drawParticle(playerPos, ['e33532'], playerSize);
}
function playerCalc() {
  if (keypress['37']) playerPos[0] -= playerSpeed/100*(1/boxSize)*(tSpeed/33);
  if (keypress['38']) playerPos[1] -= playerSpeed/100*(1/boxSize)*(tSpeed/33);
  if (keypress['39']) playerPos[0] += playerSpeed/100*(1/boxSize)*(tSpeed/33);
  if (keypress['40']) playerPos[1] += playerSpeed/100*(1/boxSize)*(tSpeed/33);
  for (var i = 0; i < 2; i++) {
    if (-1+playerSize/2 > playerPos[i]) playerPos[i] = -1+playerSize/2;
    if (1-playerSize/2 < playerPos[i]) playerPos[i] = 1-playerSize/2;
  }
}
function particleCalc() {
  var toDestory = [];
  for (var i = 0; i < enemyArr.length; i++) {
    if (enemyArr[i][5] != -1) {
      enemyArr[i][5] -= tSpeed/1000;
      if (enemyArr[i][5] < 0) {
        toDestory.push(i);
      }
    }
    var speedMulThis = 1;
    if (enemyArr[i][0].includes(2)) speedMulThis *= 1.7;
    enemyArr[i][2][0] += Math.sin(enemyArr[i][4]*Math.PI/180)*enemyArr[i][3]/100*(1/boxSize)*speedMulThis*(tSpeed/33);
    enemyArr[i][2][1] -= Math.cos(enemyArr[i][4]*Math.PI/180)*enemyArr[i][3]/100*(1/boxSize)*speedMulThis*(tSpeed/33);
    if (enemyArr[i][0].includes(3) && (Math.abs(enemyArr[i][2][0]) >= 1-enemyArr[i][1]/2 || Math.abs(enemyArr[i][2][1]) >= 1-enemyArr[i][1]/2)) {
      shootLaser(enemyArr[i][2], (enemyArr[i][4]+180)%360, enemyArr[i][1], enemyArr[i][7].leaserDecay, enemyArr[i][7].leaserInterval, enemyArr[i][7].leaserSpeed);
    }
    if (enemyArr[i][0].includes(1) && (Math.abs(enemyArr[i][2][0]) >= 1-enemyArr[i][1]/2 || Math.abs(enemyArr[i][2][1]) >= 1-enemyArr[i][1]/2)) {
      enemyArr[i][2][0] += Math.sin(enemyArr[i][4]*Math.PI/180)*enemyArr[i][3]/100*(1/boxSize)*speedMulThis*(tSpeed/33);
      enemyArr[i][2][1] -= Math.cos(enemyArr[i][4]*Math.PI/180)*enemyArr[i][3]/100*(1/boxSize)*speedMulThis*(tSpeed/33);
      enemyArr[i][4] = Math.random()*360;
    } else if (Math.abs(enemyArr[i][2][0]) >= 1+enemyArr[i][1]/2 || Math.abs(enemyArr[i][2][1]) >= 1+enemyArr[i][1]/2) {
      toDestory.push(i);
    }
    if (
      playerPos[0]+playerSize/2 > enemyArr[i][2][0]-enemyArr[i][1]/2 &&
      playerPos[0]-playerSize/2 < enemyArr[i][2][0]+enemyArr[i][1]/2 &&
      playerPos[1]+playerSize/2 > enemyArr[i][2][1]-enemyArr[i][1]/2 &&
      playerPos[1]-playerSize/2 < enemyArr[i][2][1]+enemyArr[i][1]/2
    ) {
      levelEnd();
    }
  }
  for (var i = toDestory.length-1; i >= 0; i--) {
    enemyArr.splice(toDestory[i], 1);
  }
}
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
}

//calc advenced particle
function shootLaser(position, deg, size, decay=0.5, interval=10, speed=0.1) {
  position[0] += Math.sin(deg*Math.PI/180)*size*2;
  position[1] -= Math.cos(deg*Math.PI/180)*size*2;
  makeParticle([4], size, [position[0], position[1]], speed, Math.random()*360, decay, decay);
  laserTimeout = setTimeout( function() {
    if (!(Math.abs(position[0]) >= 1-size/2 || Math.abs(position[1]) >= 1-size/2) && tempFlag) {
      shootLaser(position, deg, size, decay, interval, speed);
    }
  }, interval);
}

//game function
function makeParticle(type=[0], size=0.02, position=[0,-1], speed=1, deg=Math.random()*360, delSpan=-1, delSpanM=-1, attr={}) {
  if (typeof(position) == 'string') {
    //random
    if (position.startsWith('r')) {
      position = Number(position.substr(1));
      switch (position) {
        //edge
        case 0:
        switch (Math.floor(Math.random()*4)) {
          //top
          case 0:
          position = [Math.random()*2-1, -1+size/2];
          deg = (90+180*Math.random())%360;
            break;
          //bottom
          case 1:
          position = [Math.random()*2-1, 1-size/2];
          deg = (270+180*Math.random())%360;
            break;
          //left
          case 2:
          position = [-1+size/2, Math.random()*2-1];
          deg = (0+180*Math.random())%360;
            break;
          //right
          case 3:
          position = [1-size/2, Math.random()*2-1];
          deg = (180+180*Math.random())%360;
            break;
          default:
        }
          break;
      }
    }
  }
  enemyArr.push([type, size, position, speed, deg, delSpan, delSpanM, attr]);
}
function destoryParticle(per=1, delSpan=0.5, type='all') {
  for (var i = 0; i < enemyArr.length; i++) {
    if (Math.random() < per) {
      var destoryCheck = 0;
      if (type == 'all') {
        destoryCheck = 1;
      } else {
        var includeCheck = 0;
        for (var j = 0; j < enemyArr[i][0].length; j++) {
          if (type.includes(enemyArr[i][0][j])) {
            includeCheck++;
          }
        }
        if (includeCheck == enemyArr[i][0].length) {
          destoryCheck = 1;
        }
      }
      if (destoryCheck) {
        enemyArr[i][5] = delSpan;
        enemyArr[i][6] = delSpan;
      }
    }
  }
}
function changeBoxSize(size=1) {
  var shrinkPer = boxSize/size;
  boxSize = size;
  for (var i = 0; i < enemyArr.length; i++) {
    enemyArr[i][2][0] *= shrinkPer;
    enemyArr[i][2][1] *= shrinkPer;
  }
}
function levelEnd() {
  collisionAudio = new Audio('sounds/collision.wav');
  collisionAudio.play();
  try {
    audio.pause();
  } catch {

  }
  destoryParticle(1, 0, 'all');
  clearInterval(bulletInterval);
  clearTimeout(laserTimeout);
  tempFlag = 0;
  endInterval(mapData);
  updateEditorPlay();
}

//game loop
tSpeed = 20;
setInterval( function () {
  setBoxSize();
  playerCalc();
  particleCalc();
  drawBox();
  if (editing) {
    textboxHandle();
  }
}, tSpeed);

//init
bulletInterval = setInterval( function () {}, 100);
laserTimeout = setTimeout( function () {}, 100);
