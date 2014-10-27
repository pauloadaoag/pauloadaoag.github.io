
  var canvas = new fabric.Canvas('c');
  canvas.on('after:render', function(){ this.calcOffset(); });


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
      this.timer = null;
      var that = this;
      options || (options = { });
      options.hasControls = false;
      options.hasBorders = false;
      this.selectable = true;
      this.origTop = options.top;
      this.leftLimit = options.timeline.left - options.width/2
      this.left = this.leftLimit;
      if (options.left) this.left = options.left;
      this.timeline = options.timeline;

      this.rightLimit = options.timeline.left + options.timeline.width -  options.width/2;
      this.tipHeight = options.tipHeight;
      options.hasRotatingPoint = false;
      this.callSuper('initialize', options);
      this.set('label', options.label || '');


      this.on('moving', function(){
        if (that.timer) clearTimeout(that.timer);
        if (that.timeline.zoomState == 0) {
          that.timer = setTimeout(function(){
            var center = that.left;
            var pInParent = (center) / (that.timeline.width);
            var newWidth = pInParent * (that.timeline.width * 4);
            var newSliderLeft = (center + that.timeline.left) - newWidth;
            that.timeline.zoomIn({left:newSliderLeft});
          }, 500);          
        }

        this.top = this.origTop;
        if (this.left <= this.leftLimit ) this.left = this.leftLimit;
        if (this.left >= this.rightLimit) this.left = this.rightLimit;
      });
      this.on('mouseup', function(){
        console.log('up')
        clearTimeout(that.timer);
        if (that.timeline.zoomState > 0) {
          var center = that.left;
          var pInParent = (center - that.timeline.left + that.timeline.origLeft) / (that.timeline.width);
          that.left = (pInParent * that.timeline.origWidth);
          console.log("zooming out!  - %d" , that.left  )
          that.timeline.zoomOut();
          that.selectable = true;
          canvas.renderAll();
          canvas.calcOffset();
          clearTimeout(that.timer)
        }
        return;
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
      if (this.timeline.zoomState > 0) var pct = (this.left - this.timeline.left + this.timeline.origLeft) /this.timeline.width;
      ctx.fillText(this.label +":" +perCentToTime(pct), 0,2);
    }
  });

  var TimeLine = fabric.util.createClass(fabric.Object, {
    type: 'TimeLine',
    initialize  : function(options) {
      var that = this;
      this.origLeft = options.left;
      this.origWidth = options.width;
      this.zoomState = 0;
      options.hasControls = false;
      options.hasBorders = false;
      options.hasRotatingPoint = false;
      options.selectable = false;
      this.callSuper('initialize', options);  
      this.on("mousedown", function(e){
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
    zoomIn: function(args) {
      if (this.zoomState != 1) {
        this.zoomState = 1;
        this.width = this.width * 4;
        this.left = args.left;
        console.log("newleft:%d",args.left)
        canvas.renderAll();  
      }
      
    },
    zoomOut: function() {
      if (this.zoomState == 1) {
        this.zoomState = 0;
        this.left = this.origLeft;
        this.width = this.width / 4;
        canvas.renderAll();
      }
    },

    _render: function(ctx){
      ctx.strokeStyle="#000000";
      ctx.beginPath();
      ctx.moveTo(-this.width/2, this.height/2);
      ctx.lineTo(this.width/2, this.height/2)
      ctx.stroke();

      for (var i = 0; i <= 24; i++){
        if ((this.zoomState == 0) && (i%2 == 1)) continue;
        ctx.beginPath();
        x = -this.width/2 + ((this.width/24)*i);
        ctx.moveTo(x, this.height/2);
        ctx.lineTo(x, this.height/2 - 15);
        ctx.stroke();
        ctx.textAlign = 'center';
        ctx.fillText(i+"00", x, this.height/2 + 10);
      }
      var minTickDist = this.width/(24*12);
      if (this.zoomState > 0) {
        for (var i = 0; i < 24; i++) {
          var edge = 12*i;
          console.log(edge)
          for (var j = 0; j < 12; j++) {
            var x = -this.width/2 + ((minTickDist) * (edge+ j));
            ctx.beginPath();
            ctx.moveTo(x, this.height/2);
            if (j == 6) ctx.lineTo(x, this.height/2 - 10);
            else ctx.lineTo(x, this.height/2 - 5);
            ctx.stroke();
          }
        }
      }
    }
  });
  var timeline = new TimeLine({
    width: CANVAS_WIDTH - 100,
    height: 20,
    left: 30,
    top: 20,
    zoom: true,
    label: 'Left',
    fill: '#222',
  });
  canvas.add(timeline);



$(document).on("vmousemove", "body", function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
});

