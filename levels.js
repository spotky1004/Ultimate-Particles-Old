function level1() {
  loopCount = 0;
  playerSize = 0.1;
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
