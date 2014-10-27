$.fn.slider = function(option, val) {

  return this.each(function() {

    var $this = $(this),
      data = $this.data('slider'),
      options = typeof option === 'object' && option;
    if (!data) {
      $this.data('slider', (data = new Slider(this, $.extend({}, $.fn.slider.defaults, options))));
    }
    if (typeof option == 'string') {
      data[option](val);
    }
  })
};


$.fn.slider = function() {
  var timer;
  var parent = $(this);
  var tooltipStr = ('<div class="tooltip top in" style="bottom: 0px; left: 0px;"><div class="tooltip-arrow"></div><div class="tooltip-inner" id="mylabel">drag</div></div>');
  var toolTips = [];
  var slider = $('<div class="slider"></div>')
  var timeInField = $('<input type="text">')

  var timeOutField = $('<input type="text">')
  var leftEdge = $(this).position().left;
  var rightEdge = leftEdge + $(this).width();
  var topEdge = $(this).position().top;
  var originalSliderWidth = 0;
  var expandedSliderWidth = 0;
  var perCentToTime = function(pct) {
    var totalMins = pct * (24 * 60);
    totalMins = Math.floor(totalMins);
    var mm = (totalMins % 60).toFixed(0);
    var hh = (Math.floor(totalMins / 60)).toFixed(0);
    hh = (hh.length < 2) ? ("0" + hh) : (hh)
    mm = (mm.length < 2) ? ("0" + mm) : (mm)
    return (hh + ":" + mm)
  }
  var pixToTime = function(pix) {
    var totalMins = pix / 8;
    var mm = (totalMins % 60).toFixed(0);
    var hh = (Math.floor(totalMins / 60)).toFixed(0);
    hh = (hh.length < 2) ? ("0" + hh) : (hh)
    mm = (mm.length < 2) ? ("0" + mm) : (mm)
    return (hh + ":" + mm)
  }

  var tooltip = {}
  tooltip.moving = false;
  var prevYPos = -1;
  var cumDiff = 0;
  var root = $(this);

  var timerCB = function(){
    alert("timed out!");
  }

  root.on("mouseup", function(){
    if (timer) clearTimeout(timer);
    if (movingToolTip) {
        var tooltipcenter = movingToolTip.position().left + (movingToolTip.width() / 2);

        $('.tooltip').show();
        movingToolTip.attr("snapPos", "top")
        movingToolTip.css("bottom", bottom + "px")
        posWithinParent = tooltipcenter / slider.width();
        if (posWithinParent < 0) posWithinParent = 0;
        if (posWithinParent > 1) posWithinParent = 1;
        movingToolTip.css("left", ((posWithinParent * originalSliderWidth) - (movingToolTip.width() / 2)) + "px")
        slider.css("width", originalSliderWidth + "px");
        slider.css("left", "30px");
        $(".minortick").hide()
        $('.tick').css("font-size","8px")
        movingToolTip = null;
    }
  })

  root.on("mousemove", function(event) {
    
    var ydiff = event.pageY - prevYPos;
    cumDiff += ydiff;
    prevYPos = event.pageY;
    if (movingToolTip !== null) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function(){

          if ((snapPos == "top")){
            $('.tooltip').hide();
            movingToolTip.show();
            // movingToolTip.css('bottom', "10px")
            movingToolTip.attr("snapPos", "bottom")
            slider.css("width", expandedSliderWidth + "px")
            var newWidth = posWithinParent * expandedSliderWidth;
            var newSliderLeft = (tooltipcenter + leftMargin) - newWidth;
            console.log(newSliderLeft)
            slider.css("left", newSliderLeft + "px")
            movingToolTip.css("left", newWidth - (width / 2) + "px")
            $(".minortick").show()
            $('.tick').css("font-size","12px");
          }
        }, 1000);


      var snapPos = (movingToolTip.attr("snapPos"));
      var width = (movingToolTip.width());
      var leftMargin = slider.position().left;

      if (snapPos == "bottom") {
        //If zoomed in
        var oldLeft = movingToolTip.position().left;
        var oldCenter = oldLeft + (width / 2);
        var curPos = (event.pageX - leftEdge - leftMargin)
        var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
        var newCenter = (newLeft + (width / 2));
        
        if ((event.pageX - leftEdge) < 100) {
          if (newCenter < oldCenter) {
            newCenter = newCenter + (8 - newCenter % 8);
            var diff = oldCenter - newCenter;
            var sliderLeft = slider.position().left;
            if (sliderLeft < 50) slider.css("left", sliderLeft + diff + "px");
          }
        } 
        else if ((rightEdge - event.pageX) < 100) {
          if (newCenter > oldCenter) {
            newCenter = newCenter - (newCenter % 8);
            var diff = newCenter - oldCenter;
            var sliderLeft = slider.position().left;
            if ((sliderLeft - diff) > ((root.width() - 100) - slider.width())) {
              slider.css("left", sliderLeft - diff + "px");
            }
          }
        } 
        else {
          if (newCenter > oldCenter) newCenter = newCenter - newCenter % 8;
          else newCenter = newCenter + (8 - newCenter % 8);
        }

        if (newCenter < 0) newCenter = 0;
        if (newCenter > slider.width()) newCenter = slider.width();
        movingToolTip.css("left", newCenter - (width / 2) + "px")
        movingToolTip.children("#mylabel").text(pixToTime(newCenter));
        movingToolTip.children("input").text(pixToTime(newCenter));
        tooltipcenter = movingToolTip.position().left + (width / 2);
        posWithinParent = tooltipcenter / slider.width();
      } 
      else {
        //If zoomed out
        var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
        var oldLeft = movingToolTip.position().left;
        newLeft = newLeft - newLeft % 4;
        if (newLeft + (width / 2) < 0) newLeft = -(width / 2);
        if (newLeft + (width / 2) > slider.width()) newLeft = slider.width() - (width / 2)
        movingToolTip.css('left', newLeft + "px")
        newCenter = newLeft + (width / 2);
        movingToolTip.children("#mylabel").text(perCentToTime(newCenter/slider.width()))
        movingToolTip.children('input').val(perCentToTime(newCenter/slider.width()))
      }

      var tooltipcenter = movingToolTip.position().left + (width / 2);
      var posWithinParent = tooltipcenter / slider.width();

    }
    event.stopPropagation();
  })

  //Add ticks and minor ticks
  for (var i = 0; i < 24; i++) {
    var toAppend = $("<div class='tick'></div>")  
    toAppend.text(i + ":00");
    toAppend.css("left", i * (100 / 24) + "%");
    for (var j = 1; j < 12; j++) {
      var t = $("<div class='minortick'></div>")
      t.css("left", j * (100/12) + "%")
      if (j == 6) { //30 min marks
        t.css("height", "25px")
        t.text(i+":30");
      }
      toAppend.append(t);
    }
    slider.append(toAppend);
  }

  //Add final tick at the end position
  var toAppend = $("<div class='tick'></div>")  
  toAppend.css("left","100%");
  slider.append(toAppend);

  // $('.tick').disableTextSelect();
  // $('.minortick').disableTextSelect();

  var timeInButton = $("<a class='btn btn-primary'>Time In</a>");
  var timeOutButton = $("<a class='btn btn-warning'>Time Out</a>");
  timeInButton.css("margin-left","30px")
  var setTimeIn = false;
  var setTimeOut = false;
  var timeInPlaced = false;
  var timeOutPlaced = false;

  timeInButton.on('mousedown', function(event){
    if (timeInPlaced) return;
    if (!setTimeIn) setTimeIn = true;
    setTimeOut = false;
    event.stopPropagation();
  })
  timeOutButton.on('mousedown', function(event){
    if (timeOutPlaced) return;
    if (!setTimeOut) setTimeOut = true;
    setTimeIn = false;
    event.stopPropagation();
  })

  slider.css("width","864px");

  timeInField.hide();
  timeOutField.hide();
  root.append(timeInButton);
  root.append(timeOutButton);
  root.append(slider)

  originalSliderWidth = slider.width();
  expandedSliderWidth = originalSliderWidth * 40/3;

  var initialXPos = 0;
  var movingToolTip = null
  var bottom = 50;
  var markers = [];
  var newToolTip = null;
  $(this).on('mousedown', function(data) {
    if (!((setTimeIn)||(setTimeOut))) return;     
    newToolTip = $(tooltipStr);
    if (setTimeIn) {
      newToolTip.append(timeInField)
      newToolTip.children("#mylabel").text("Time In:")
      newToolTip.children(".tooltip-inner").css("background-color","#428bca");
      newToolTip.children(".tooltip-arrow").css("border-top-color","#428bca");
      timeInButton.attr("disabled", true);
      timeInPlaced = true;
    }
    if (setTimeOut){
      newToolTip.append(timeOutField)
     newToolTip.children("#mylabel").text("Time Out:")
     newToolTip.children(".tooltip-inner").css("background-color","#f0ad4e");
     newToolTip.children(".tooltip-arrow").css("border-top-color","#f0ad4e");
     timeOutButton.attr("disabled", true)
     timeOutPlaced = true;
    }


    newToolTip.css("bottom", bottom + "px")
    newToolTip.attr("snapPos", "top")
    newToolTip.on("mousedown", function(event) {
      movingToolTip = $(this)
      prevYPos = event.pageY;
      cumDiff = 0;
      event.stopPropagation(); //Stop bubbling up to parent
    });

    slider.append(newToolTip);
    markers.push(newToolTip);
    var newCenter = data.pageX - $(this).position().left -slider.position().left;
    var pct = (data.pageX - $(this).position().left -slider.position().left)/slider.width();
    newToolTip.children("#mylabel").text(perCentToTime(pct));
    newToolTip.css("left", (data.pageX - $(this).position().left -slider.position().left - (newToolTip.width()/2))  + "px");
    
    setTimeOut = false;
    setTimeIn = false;
  })

  $(this).on("mouseup", function(event) {
    movingToolTip = null;
    event.stopPropagation(); 
  })

  return{
    getTime : function(){
      return{
        timeIn: timeInField.val(),
        timeOut: timeOutField.val()
      }
    }
  };
}
