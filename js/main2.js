
  var canvas = new fabric.Canvas('c');
  var CANVAS_HEIGHT = 500;
  var CANVAS_WIDTH = 800;
  var MARGIN = 50;
  var TIMELINE_WIDTH = CANVAS_WIDTH - (2 * MARGIN);

  canvas.setHeight(CANVAS_HEIGHT);
  canvas.setWidth(CANVAS_WIDTH);
  var zoomStatus = 'out';

  var zoomInTimeLine = function(){
    zoomStatus = 'in';
    var tF = getElemById('majorticks');
    var bias = tF[0].width / 2;
      tF[0]._objects.map(function(o,idx){
        if (o.id = "bar") return;
        var spacing = timeline.width/12 * 4;
        o.left = idx*spacing  - bias;
      });
      tF[0].left = 0;
    var tF = getElemById('majorticklabels');
    var bias = tF[0].width / 2;
      tF[0]._objects.map(function(o,idx){
        var spacing = timeline.width/12 * 4;
        o.left = idx*spacing  - bias;
      });
      tF[0].left = 0;
    canvas.renderAll();

  }

  var zoomOutTimeLine = function(){
    zoomStatus = 'out';
    var tF = getElemById('majorticks');
    var bias = tF[0].width / 2;
    tF[0]._objects.map(function(o,idx){
      if (o.id = "bar") return;
      var spacing = timeline.width/12;
      o.left = idx*spacing  - bias;
    });
    tF[0].left = 0;
    var tF = getElemById('majorticklabels');
    var bias = tF[0].width / 2;
    tF[0]._objects.map(function(o,idx){
      var spacing = timeline.width/12;
      o.left = idx*spacing  - bias;
    });
    tF[0].left = 0;
    canvas.renderAll();
  }

  var zoomout = new fabric.Circle({
      left: 100,
      top: 10,
      fill: 'red',
      radius: 10,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
      lockMovementY:true
    });
  zoomout.on('mousedown', zoomOutTimeLine)

  var zoomin = new fabric.Circle({
      left: 120,
      top: 10,
      fill: 'blue',
      radius: 10,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
      lockMovementY:true
    });
  zoomin.on('mousedown', zoomInTimeLine);

  canvas.add(zoomin)
  canvas.add(zoomout)

  var getElemById = function(id){
    var tF = canvas._objects.filter(function(c){return c.id == id});
    return tF;
  }

  var markerFactory = function(color, x, y){
    var marker = new fabric.Circle({
      left: 100,
      top: x || 80,
      fill: color,
      radius: 10,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
    });
    marker.on('moving', function(e) {
      this.top = 80;
      var lLimit = timeline.left - (this.width/2);
      var rLimit = timeline.left + timeline.width - (this.width/2);
      if (this.left > rLimit) this.left = rLimit;
      if (this.left < lLimit) this.left = lLimit;

     if ((this.left > rLimit - 50)&&(zoomStatus == 'in')) {
        this.left = (rLimit - 50);
        var tF = getElemById('majorticks');
        if (tF[0].left < 0-(timeline.width * 3)) return;
        tF[0].left = tF[0].left - 10;
        var tF = getElemById('majorticklabels');
        tF[0].left = tF[0].left - 10;
      }

      if ((this.left < 50)&&(zoomStatus == 'in')) {
        this.left = 50;
        var tF = getElemById('majorticks');
        if (tF[0].left >= 0) return;
        tF[0].left = tF[0].left + 10;
        var tF = getElemById('majorticklabels');
        tF[0].left = tF[0].left + 10;
      }

      canvas.renderAll();


    });
    return marker;

  }

  var timelineFactory = function(width_){
    var width = width_ ;
    var left = 0;
    var top = 100;
    var rect = new fabric.Rect({
      id : 'bar',
      left: left,
      top: top,
      fill: 'black',
      width: width + 2,
      height: 5,
      selectable: true
    });
    return {
      left: left,
      top: top,
      width: width,
      shape: rect
    };
  }
  var timeline = timelineFactory(TIMELINE_WIDTH);



  canvas.add(markerFactory('red', 80));
  // canvas.add(timeline.shape);
  canvas.add(markerFactory('green'));


  var majorTicks = [];
  var minorTicks = [];
  var majorTickLabels_ = [];
  for (var i = 0; i <= 12; i++){
    var spacing = timeline.width/12;
    coords = [(i*spacing + timeline.left), 90, (i*spacing + timeline.left), 100];
    var tick = new fabric.Line(coords, {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
        selectable: false,
    });
    var tickLabel = new fabric.Text((i*2)+"00", { left: (i*spacing + timeline.left), top: 100 , fontSize:10, textAlign:'center', fontFamily:'Helvetica'});
    majorTickLabels_.push(tickLabel);
    majorTicks.push(tick);
  }
  majorTicks.push(timeline.shape)
  MajorTicks = new fabric.Group(majorTicks, {left:0, top:90, selectable: false, id:"majorticks"});
  canvas.add(MajorTicks)
  canvas.add(new fabric.Group(majorTickLabels_, {left: 0, top: 120, selectable: false, id: "majorticklabels"}));


$(document).on("vmousemove", "body", function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
});

