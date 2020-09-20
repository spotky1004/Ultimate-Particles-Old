function level1() {
  loopCount = 0;
  playerSize = 0.1;
  playerSpeed = 0.8;
  boxSize = 1;
  bulletInterval = setInterval( function () {
    if (Math.random() < 0.1+loopCount/10000) {
      makeParticle([0], 0.02+Math.sqrt(loopCount)/10000, 'r0', 0.6);
      loopCount++;
      playerSize *= 0.9999;
      changeBoxSize(boxSize*0.9999);
    }
  }, 20);
  audio = new Audio('sounds/lv1.wav');
  audio.play();
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
}
function levelA() {
  loopCount = 0;
  playerSize = 0.05;
  playerSpeed = 1.6;
  boxSize = 1;
  bulletInterval = setInterval( function () {
    if (Math.random() < 0.1+loopCount/1000) {
      partiThis = [0];
      if (Math.random() < 0.2) {
        partiThis.push(1);
      }
      if (Math.random() < 0.2) {
        partiThis.push(2);
      }
      makeParticle(partiThis, 0.03, 'r0', 1.3);
      loopCount++;
      playerSize *= 0.9995;
      changeBoxSize(boxSize*0.9995);
      if (playerSize < 0.02) {
        playerSize = 0.05;
        boxSize = 1;
      }
    }
  }, 15);
  audio = new Audio('sounds/lv5.wav');
  audio.play();
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
}
