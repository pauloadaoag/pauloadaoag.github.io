
  var canvas = new fabric.Canvas('c');
  var CANVAS_HEIGHT = 500;
  var CANVAS_WIDTH = 800;
  var MARGIN = 50;
  var TIMELINE_WIDTH = CANVAS_WIDTH - (2 * MARGIN);
  fabric.isTouchSupported = true;
  canvas.setHeight(CANVAS_HEIGHT);
  canvas.setWidth(CANVAS_WIDTH);
  var zoomStatus = 'out';

  var getElemById = function(id){
    var tF = canvas._objects.filter(function(c){return c.id == id});
    return tF;
  }

  var zoomInTimeLine = function(){
    if (zoomStatus == 'in') return;
    zoomStatus = 'in';
    var tF = getElemById('majorticks');
    var bias = tF[0].width / 2;
      tF[0]._objects.map(function(o,idx){
        if (o.id != "bar")  {
          var spacing = timeline.width/12 * 4;
          o.left = idx*spacing  - bias;
        } else {
          o.width = o.width * 4;
        }
        
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
    if (zoomStatus == 'out') return;
    zoomStatus = 'out';
    var tF = getElemById('majorticks');
    var bias = tF[0].width / 2;
    tF[0]._objects.map(function(o,idx){
      if (o.id != "bar") {
        var spacing = timeline.width/12;
        o.left = idx*spacing  - bias;
      } else {
        o.width = o.width/4;
      }
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

  var perCentToTime = function(pct) {
    var totalMins = pct * (24 * 60);
    totalMins = Math.floor(totalMins);
    var mm = (totalMins % 60).toFixed(0);
    var hh = (Math.floor(totalMins / 60)).toFixed(0);
    hh = (hh.length < 2) ? ("0" + hh) : (hh)
    mm = (mm.length < 2) ? ("0" + mm) : (mm)
    return (hh + ":" + mm)
  }


  var Tick = fabric.util.createClass(fabric.Rect, {
    type: 'tick',
    initialize: function(options) {
      options || (options = { });
      options.hasControls = false;
      options.hasBorders = false;
      this.selectable = true;
      this.origTop = options.top;
      this.leftLimit = options.timeline.left - options.width/2
      this.left = this.leftLimit;
      if (options.left) this.left = options.left;
      this.timelie = options.timeline;
      this.rightLimit = options.timeline.left + options.timeline.width -  options.width/2;
      this.tipHeight = options.tipHeight;
      options.hasRotatingPoint = false;
      this.callSuper('initialize', options);
      this.set('label', options.label || '');
      this.on('mousedown', function(){
        console.log("asd")
      })
      this.on('moving', function(){
        this.top = this.origTop;
        if (this.left <= this.leftLimit ) this.left = this.leftLimit;
        if (this.left >= this.rightLimit) this.left = this.rightLimit;
      })
    },


    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        label: this.get('label')
      });
    },


    _render: function(ctx) {
      this.callSuper('_render', ctx);
      ctx.moveTo(0,0)
      ctx.beginPath();
      ctx.moveTo(-10,this.height/2);
      ctx.lineTo(10,(this.height/2));
      ctx.lineTo(0,(this.height/2)+this.tipHeight);
      ctx.fill();
      ctx.font = '10px Helvetica';
      ctx.fillStyle = '#fff';
      ctx.fillRect(0,0,1,1)
      ctx.textAlign = 'center';
      var pct = this.left / this.timeline.width;
      ctx.fillText(this.label +":" +perCentToTime(pct), 0,2);
    }
  });

  var TimeLine = fabric.util.createClass(fabric.Object, {
    type: 'TimeLine',
    initialize  : function(options) {
      var that = this;
      options.hasControls = false;
      options.hasBorders = false;
      options.hasRotatingPoint = false;
      options.selectable = false;
      this.callSuper('initialize', options);  
      this.on("mousedown", function(e){

        console.log(e.e.offsetX);
        console.log(e);
        h = 40;
        t = that.top - h/2;
        var t = new Tick({
          width: 60,
          height: h,
          timeline: this,
          left : (e.e.offsetX  - that.left),
          top: t - 10,
          tipHeight: 10,
          label: 'Left',
          fill: '#222',
        });
        canvas.add(t);
      })

    },
    _render: function(ctx){
      ctx.strokeStyle="#FF0000";
      ctx.beginPath();
      ctx.moveTo(-this.width/2, this.height/2);
      ctx.lineTo(this.width/2, this.height/2)
      ctx.stroke();

      for (var i = 0; i <= 12; i++){
        ctx.beginPath();
        x = -this.width/2 + (this.width/12)*i;
        ctx.moveTo(x, this.height/2);
        ctx.lineTo(x, this.height/2 - 20);
        ctx.stroke();
      }
    }
  });
  var timeline = new TimeLine({
    width: CANVAS_WIDTH - 100,
    height: 20,
    left: 30,
    top: 20,
    label: 'Left',
    fill: '#222',
  });
  canvas.add(timeline);

  // var zoomInButton = new Tick({
  //   width: 60,
  //   height: 20,
  //   timeline: timeline,
  //   top: 10,

  //   tipHeight: 10,
  //   label: 'Left',
  //   fill: '#222',
  // });
  //   var zoomOutButton = new Tick({
  //   width: 60,
  //   height: 20,
  //   timeline: timeline,
  //   tipHeight: 10,
  //   top: 10,
  //   label: 'Left',
  //   fill: '#222',
  // });
  // canvas.add(zoomInButton);
  // canvas.add(zoomOutButton)



  var zoomout = new fabric.Circle({
      left: 100,
      top: 10,
      fill: 'red',
      radius: 10,
      hasBorders: false,
      hasControls: false,
      hasRotatingPoint: false,
      lock2mentY:true
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

