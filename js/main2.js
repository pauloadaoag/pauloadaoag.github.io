var canvas = new fabric.Canvas('c');

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 600,
  height: 20,
  selectable: false
});
var rect2 = new fabric.Circle({
  left: 100,
  top: 80,
  fill: 'green',
  radius: 10,
  hasBorders: false,
  hasControls: false,
  hasRotatingPoint: false

});


rect2.method = function(msg) {
  console.log(msg);
}
canvas.add(rect);
canvas.add(rect2);
for (var i = 0; i <= 12; i++){
  coords = [i*50 + 100, 80, i*50 + 100, 100];
  canvas.add(new fabric.Line(coords, {
      fill: 'black',
      stroke: 'black',
      strokeWidth: 5,
      selectable: false,


  })); 
}
rect2.on('moving', function(e) {
  this.method("lols");
  this.top = 80;
  if (e.target) {
    console.log(e.target.top);    
    e.target.top = 80;       
  }
});
