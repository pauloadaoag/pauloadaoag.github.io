
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

var pixToTime = function(pix){
  var totalMins = pix/8;
  var mm = (totalMins%60).toFixed(0);
  var hh = (Math.floor(totalMins/60)).toFixed(0);
  hh = (hh.length < 2)?("0"+hh):(hh)
  mm = (mm.length < 2)?("0"+mm):(mm)
  return (hh+":"+mm)
}

$.fn.slider = function() {
    var parent = $(this);
    var tooltipStr = ('<div class="tooltip top in" style="bottom: 0px; left: 0px;"><div class="tooltip-arrow"></div><div class="tooltip-inner">drag</div></div>');
    var toolTips = [];
    var slider = $('<div class="slider"></div></div>')
    var leftEdge = $(this).position().left;
    var topEdge = $(this).position().top;
    var originalSliderWidth = 0;
    var expandedSliderWidth = 0;

    console.log(leftEdge)
    var tooltip = {}
    tooltip.moving = false;


    var root = $(this)

    root.on("mousemove", function(event) {
        if (movingToolTip !== null) {
            var snapPos = (movingToolTip.attr("snapPos"))
            var distanceToTop = (event.pageY - topEdge)
            var left = $(this).position().left;
            var width = (movingToolTip.width())
            var leftMargin = slider.position().left
            
            if (snapPos == "top"){
              var oldLeft = movingToolTip.position().left;
              var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
              if (newLeft > oldLeft){ newLeft = newLeft - newLeft%8; movingToolTip.css('left', (newLeft - (width/2)) + "px")  }
              else { newLeft = newLeft + (8 - newLeft%8); movingToolTip.css('left', (newLeft + (width/2)) + "px")  }
              $("#mylabel").text(pixToTime(newLeft))
            }
            
            else{
              var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
              var oldLeft = movingToolTip.position().left;
              if (Math.abs(newLeft - oldLeft) >= 4) movingToolTip.css('left', newLeft+4 + "px")  
            }
            

            
            var tooltipcenter = movingToolTip.position().left + (width/2);
            var posWithinParent = tooltipcenter / slider.width();

            if (snapPos == "top") {
                //slider.css("left",-(event.pageX - leftEdge)+"px")
            }
            console.log(distanceToTop)
            if ((snapPos == "bottom") && (distanceToTop > 80)) {
                movingToolTip.css('bottom', "10px")
                movingToolTip.attr("snapPos", "top")
                slider.css("width", expandedSliderWidth + "px")
                var newWidth = posWithinParent * expandedSliderWidth;
                var newSliderLeft = (tooltipcenter  + leftMargin) - newWidth;
                slider.css("left", newSliderLeft + "px")
                movingToolTip.css("left", newWidth - (width/2) + "px")
                $(".minortick").show()
            }
            if ((snapPos == "top") && (distanceToTop < 50)) {
                movingToolTip.attr("snapPos", "bottom")
                movingToolTip.css("bottom", bottom + "px")
                posWithinParent = tooltipcenter / slider.width();
                movingToolTip.css("left", ((posWithinParent * expandedSliderWidth)) + "px")
                slider.css("width", originalSliderWidth + "px")
                slider.css("left", "30px")
                $(".minortick").hide()
                
            }
            
        }
        event.stopPropagation();
    })

    //populate with ticks
    var ticks = [];
    for (var i = 0; i < 24; i++) {
        var toAppend = $("<div class='tick'></div>")
        toAppend.text(i)
        toAppend.css("left", i * (100/24) + "%");
        for (var j = 1; j < 4; j++){
          var t = $("<div class='minortick'></div>")
          t.css("left", j * 25 + "%")

          toAppend.append(t);
        }
        ticks.push(toAppend)
        slider.append(toAppend);
    }


    

    var addedAlready = false;

    $(this).append(slider)
    originalSliderWidth = slider.width();
    expandedSliderWidth = originalSliderWidth * 10;

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
    $(this).on("mouseleave", function(event) {
        movingToolTip = null;
        event.stopPropagation(); //Stop bubbling up to parent
    })
    // $(this).on('mouseleave',function(data){

    // })

}

$('.tSlider').slider();
$('.tSlider').disableTextSelect();
$('.jumbotron').disableTextSelect();
