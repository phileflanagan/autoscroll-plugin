var element1 = document.getElementById('element1');
var element2 = document.getElementById('element2');

const Scroller1 = new AutoScroll(element1, {
  speed: 5,
  requestAnimationFrame: false
});
var Scroller2 = new AutoScroll(element2, {
  speed: 120,
});
