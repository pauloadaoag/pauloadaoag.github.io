// app = angular.module('timeClock',[])


// app.controller('timeClockCtrl', ['$scope', '$filter', function  ($scope, $filter) {

//  $scope.timeTicks = [];
//   var minsInDay = 60*24;
//  for (var i = 0; i < minsInDay; i++){
//    $scope.timeTicks.push(i);
//  }

//   $scope.spacing = 1;
//   $scope.adjustSpacing = function  () {
//     if ($scope.spacing == 10) $scope.spacing = 30;
//     else $scope.spacing = 10;
//     // body...
//   }

//   var minsToTime = function(mins){
//     var minutes = (mins%60).toString();
//     var hours = (Math.floor(mins/60)).toString();
//     minutes = (minutes.length == 1)?("0"+minutes):(minutes)
//     hours = (hours.length == 1)?("0"+hours):(hours)
//     return (hours + ":" + minutes)
//   }

//   $scope.reportTime = function(){
//     console.log(this);
//     //console.log($filter('minsToTime', this.tick))
//     $scope.timeSelected = (minsToTime(this.tick))
//   }
//  // body...
// }])


// app.filter('minsToTime', function  () {
//   return function(mins){
//     var minutes = (mins%60).toString();
//     var hours = (Math.floor(mins/60)).toString();
//     minutes = (minutes.length == 1)?("0"+minutes):(minutes)
//     hours = (hours.length == 1)?("0"+hours):(hours)
//     return (hours + ":" + minutes)
//   }
//   // body...
// })


// $(document).ready(function  () {
//   $( "#timeclock" ).draggable({ axis: "x", grid: [ 17, 17 ] });  // body...
//   $("#dragme").draggable({axis : "x"})
//  console.log("ready")
// })
//  


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
    var parent = $(this);
    var tooltipStr = ('<div class="tooltip top in" style="bottom: 0px; left: 0px;"><div class="tooltip-arrow"></div><div class="tooltip-inner">drag</div></div>');
    var toolTips = [];
    var slider = $('<div class="slider"></div></div>')
    var leftEdge = $(this).position().left;
    var topEdge = $(this).position().top;
    console.log(leftEdge)
    var tooltip = {}
    tooltip.moving = false;
    //tooltip.disableTextSelect()
    // tooltip.on("mousedown", function(event){
    //   console.log("tooltip clicked")
    //   tooltip.moving = !tooltip.moving;
    //   event.stopPropagation(); //Stop bubbling up to parent
    // })

    // tooltip.on("mouseup", function(event){
    //   if (tooltip.moving) tooltip.moving = false;
    // })


    var root = $(this)
    $(this).on("mousemove", function(event) {
        //console.log("x: %s - y: %s ", event.pageX, event.pageY)
        if (movingToolTip !== null) {
            var snapPos = (movingToolTip.attr("snapPos"))
            var distanceToTop = (event.pageY - topEdge)
            var left = $(this).position().left;
            var width = (movingToolTip.width())
            var leftMargin = slider.position().left
            var posWithinParent = (event.pageX - leftEdge + (width/2)  - leftMargin )/slider.width();
            //var newLeft = (event.pageX - leftEdge - (width / 2) + leftMargin)
            var newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
            movingToolTip.css('left', newLeft + "px")

            console.log("%s - leftMargin: %s posinparent:%s", newLeft, leftMargin, posWithinParent)
            if (snapPos == "top"){
              //slider.css("left",-(event.pageX - leftEdge)+"px")
            }

            if ((snapPos == "bottom")&&(distanceToTop < 30)) {
                movingToolTip.css('bottom', "30px")
                movingToolTip.attr("snapPos","top")
                // for (var i = 0; i < ticks.length; i++){
                //   ticks[i].css("left", 2*i * (100/12)+"%")
                // }
                debugger;
                slider.css("width", "2400px")
                var oldLeftMargin = slider.position().left;
                var pol = event.pageX - leftEdge - (posWithinParent*2400) + width + oldLeftMargin;
                //slider.css("left", -(posWithinParent*(2400) - event.pageX + leftEdge - oldLeftMargin)  +"px")
                slider.css("left", pol  +"px")
                leftMargin = slider.position().left
                newLeft = (event.pageX - leftEdge - (width / 2) - leftMargin)
                movingToolTip.css('left', newLeft + "px")
                //movingToolTip.css("left", posWithinParent*100 + "%")
                //movingToolTip.css("left", posWithinParent*100 + "%")
                // console.log(posWithinParent*100)
                // console.log(slider.position())

            }
            if ((snapPos == "top")&&(distanceToTop > 70)) {
                movingToolTip.attr("snapPos","bottom")
                movingToolTip.css("bottom", bottom + "px")
                // for (var i = 0; i < ticks.length; i++){
                //   ticks[i].css("left", i * (100/12)+"%")
                // }
                 posWithinParent = (event.pageX - leftEdge + (width/2))/2400;
                movingToolTip.css("left", ((posWithinParent*600)) + "px")
                slider.css("width", "600px")
                slider.css("left","30px")
            }

        }
        event.stopPropagation();
    })

    var ticks = [];

    for (var i = 0; i < 24; i++) {
        var toAppend = $("<div class='tick'></div>")
        toAppend.text(i+1)
        toAppend.css("left", i * (100 / 24) + "%");
        ticks.push(toAppend)
        slider.append(toAppend);
    }

    var expand = function() {

    }

    $(this).append(slider)
    var initialXPos = 0;
    var movingToolTip = null
    var bottom = slider.height();
    $(this).on('mousedown', function(data) {
        var newToolTip = $(tooltipStr);

        toolTips.push(newToolTip)
        newToolTip.css("left", data.offsetX + "px")
        newToolTip.css("bottom", bottom + "px")
        newToolTip.attr("snapPos","bottom")
        newToolTip.disableTextSelect();
        newToolTip.on("mousedown", function(event) {
            movingToolTip = $(this)
            event.stopPropagation(); //Stop bubbling up to parent
        });

        slider.append(newToolTip);
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
