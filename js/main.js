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

$.fn.slider = function(){
  
  var tooltipStr = ('<div class="tooltip top in" style="bottom: 0px; left: 0px;"><div class="tooltip-arrow"></div><div class="tooltip-inner">here</div></div>');
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
  $(this).on("mousemove", function(event){
    
    if (movingToolTip !== null){
      var distanceToTop = (event.pageY - topEdge)
      var left = $(this).position().left;
      var width = (movingToolTip.width())
      movingToolTip.css('left', (event.pageX - leftEdge - (width/2)) +"px")
      if (distanceToTop < 30){
        movingToolTip.css('bottom', "30px")
        // for (var i = 0; i < ticks.length; i++){
        //   ticks[i].css("left", 2*i * (100/12)+"%")
        // }
        slider.css("width","1200px")
      }
      if (distanceToTop > 70){
        movingToolTip.css("bottom",bottom  + "px")    
        // for (var i = 0; i < ticks.length; i++){
        //   ticks[i].css("left", i * (100/12)+"%")
        // }
        slider.css("width","600px")
      }
      
    }
    event.stopPropagation(); 
  })

  var ticks = [];

  for (var i = 0; i < 12; i++){
    var toAppend = $("<div class='tick'></div>")
    toAppend.css("left", i * (100/12) + "%");
    ticks.push(toAppend)
    slider.append(toAppend);
  }
  
  var expand = function(){

  }
  
  $(this).append(slider)
  var initialXPos = 0;
  var movingToolTip = null
  var bottom = slider.height();
  $(this).on('mousedown',function(data){
    var newToolTip = $(tooltipStr);

    toolTips.push(newToolTip)
    newToolTip.css("left", data.offsetX+"px")
    newToolTip.css("bottom", bottom+"px")
    newToolTip.disableTextSelect();
    newToolTip.on("mousedown", function(event){
      movingToolTip = $(this)
      event.stopPropagation(); //Stop bubbling up to parent
    })



    slider.append(newToolTip);
    console.log(newToolTip.height())
    
    console.log(toolTips.length)
    

    //initialXPos = toolTips[toolTips.length - 1].position().top;
  })
  // })

  // $(this).on('mouseup',function(){
  //   console.log("mouseup")
  //   if (tooltip.moving) tooltip.moving = false;
  // })
    $(this).on("mouseup", function(event){
      movingToolTip = null;
      event.stopPropagation(); //Stop bubbling up to parent
    })
    $(this).on("mouseleave", function(event){
      movingToolTip = null;
      event.stopPropagation(); //Stop bubbling up to parent
    })
  // $(this).on('mouseleave',function(data){
    
  // })

}

$('.tSlider').slider();
