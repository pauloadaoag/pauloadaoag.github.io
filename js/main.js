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
var perCentToTime = function(pct){
  console.log(pct)
  var totalMins = pct * (24*60);
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

$.fn.slider = function() {
    var parent = $(this);
    var tooltipStr = ('<div class="tooltip top in" style="bottom: 0px; left: 0px;"><div class="tooltip-arrow"></div><div class="tooltip-inner">drag</div></div>');
    var toolTips = [];
    var slider = $('<div class="slider"></div></div>')
    var leftEdge = $(this).position().left;
    var rightEdge = leftEdge + $(this).width();
    var topEdge = $(this).position().top;
    var originalSliderWidth = 0;
    var expandedSliderWidth = 0;

    console.log(leftEdge)
    var tooltip = {}
    tooltip.moving = false;
    var prevYPos = -1;
    var cumDiff = 0;
    var root = $(this)

    root.on("mousemove", function(event) {
      
      var ydiff = event.pageY - prevYPos;
      cumDiff+=ydiff;
      prevYPos = event.pageY;
      
      //console.log("pagey:%s, topedge:%s, distancetotop:%s",event.pageY, topEdge, distanceToTop)

        if (movingToolTip !== null) {
            var snapPos = (movingToolTip.attr("snapPos"))
            
            var width = (movingToolTip.width())
            var leftMargin = slider.position().left

            if (snapPos == "top") {
                var oldLeft = movingToolTip.position().left;
                var oldCenter = oldLeft + (width / 2);
                var curPos = (event.pageX - leftEdge - leftMargin)
                var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
                var newCenter = (newLeft + (width / 2));
                // console.log("oldleft %s leftEdge: %s oldcenter %s curpos %s newleft %s pagex %s leftedge %s newCenter %s", oldLeft, leftEdge, oldCenter, curPos, newLeft, event.pageX, leftEdge, newCenter)
                
                if ((event.pageX - leftEdge) < 100) {
                  
                    if (newCenter < oldCenter) {
                        newCenter = newCenter + (8 -newCenter % 8);
                        if (newCenter < 0) newCenter = 0;
                        var diff = oldCenter - newCenter;
                        var sliderLeft = slider.position().left;
                        if (sliderLeft < 50) slider.css("left", sliderLeft + diff + "px");
                        movingToolTip.css("left", newCenter - (width / 2) + "px")
                    }
                  
                } else if ((rightEdge - event.pageX) < 100) {

                    if (newCenter > oldCenter) {
                        newCenter = newCenter - (newCenter % 8);
                        var diff = newCenter - oldCenter;
                        if (newCenter > (24*8*60)) newCenter = (24*8*60);
                        var sliderLeft = slider.position().left;
                        if ((sliderLeft-diff) > ((root.width()-100) - slider.width())) {
                          slider.css("left", sliderLeft - diff + "px");
                        }
                        movingToolTip.css("left", newCenter - (width/2) + "px")           
                    }
                } else {
                    if (newCenter > oldCenter) {
                        newCenter = newCenter - newCenter % 8;
                        movingToolTip.css("left", newCenter - (width / 2) + "px")
                    } else {
                        newCenter = newCenter + (8 - newCenter % 8);
                        movingToolTip.css("left", newCenter - (width / 2) + "px")
                    }

                }

                $("#mylabel").text(pixToTime(newCenter))
                tooltipcenter = movingToolTip.position().left + (width / 2);
                posWithinParent = tooltipcenter / slider.width();
                console.log(posWithinParent)
            } 

            else {
                var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
                var oldLeft = movingToolTip.position().left;
                newLeft = newLeft - newLeft%4;
                if (newLeft + (width/2) < 0) newLeft = -(width/2);
                movingToolTip.css('left', newLeft  + "px")
                newCenter = newLeft + (width/2);


                $("#mylabel").text(perCentToTime(newCenter / slider.width()))
                //if (Math.abs(newLeft - oldLeft) >= 4) 
            }



            var tooltipcenter = movingToolTip.position().left + (width / 2);
            var posWithinParent = tooltipcenter / slider.width();
            

            //Move down
            if ((snapPos == "bottom") && (cumDiff > 20)) {

                movingToolTip.css('bottom', "10px")
                movingToolTip.attr("snapPos", "top")
                slider.css("width", expandedSliderWidth + "px")
                var newWidth = posWithinParent * expandedSliderWidth;
                var newSliderLeft = (tooltipcenter + leftMargin) - newWidth;
                slider.css("left", newSliderLeft + "px")
                movingToolTip.css("left", newWidth - (width / 2) + "px")
                $(".minortick").show()
                movingToolTip = null;
            }
            
            //Move Up
            if ((snapPos == "top") && (cumDiff < -20)) {

                movingToolTip.attr("snapPos", "bottom")
                movingToolTip.css("bottom", bottom + "px")
                posWithinParent = tooltipcenter / slider.width();
                console.log(posWithinParent)
                if (posWithinParent < 0) posWithinParent = 0;
                if (posWithinParent > 1) posWithinParent = 1;
                movingToolTip.css("left", ((posWithinParent * originalSliderWidth) - (width/2)) + "px")
                slider.css("width", originalSliderWidth + "px")
                slider.css("left", "30px")
                $(".minortick").hide()
                movingToolTip = null;
                
            }

        }
        event.stopPropagation();
    })

    //populate with ticks
    var ticks = [];
    for (var i = 0; i < 24; i++) {
        var toAppend = $("<div class='tick'></div>")
        toAppend.text(i)
        toAppend.css("left", i * (100 / 24) + "%");
        for (var j = 1; j < 4; j++) {
            var t = $("<div class='minortick'></div>")
            t.css("left", j * 25 + "%")
            if (j==2) t.css("height","25px")

            toAppend.append(t);
        }
        ticks.push(toAppend)
        slider.append(toAppend);
    }




    var addedAlready = false;

    $(this).append(slider)
    originalSliderWidth = slider.width();
    expandedSliderWidth = originalSliderWidth * 20;

    var initialXPos = 0;
    var movingToolTip = null
    var bottom = 30;
    $(this).on('mousedown', function(data) {
        if (addedAlready) return;
        addedAlready = true;
        var newToolTip = $(tooltipStr);

        toolTips.push(newToolTip)

        newToolTip.css("bottom", bottom + "px")
        newToolTip.attr("snapPos", "bottom")
        newToolTip.disableTextSelect();
        newToolTip.on("mousedown", function(event) {
            movingToolTip = $(this)
            prevYPos = event.pageY;
            cumDiff = 0;
            event.stopPropagation(); //Stop bubbling up to parent
        });

        slider.append(newToolTip);
        //newToolTip.css("left", data.offsetX + "px")
        console.log(slider.width())
        newToolTip.css("left", 0 + "px")
    })

    $(this).on("mouseup", function(event) {
        movingToolTip = null;
        event.stopPropagation(); //Stop bubbling up to parent
    })
    // $(this).on("mouseleave", function(event) {
    //     movingToolTip = null;
    //     event.stopPropagation(); //Stop bubbling up to parent
    // })
    // $(this).on('mouseleave',function(data){

    // })

}

$('.tSlider').slider();
$('.tSlider').disableTextSelect();
$('.jumbotron').disableTextSelect();
