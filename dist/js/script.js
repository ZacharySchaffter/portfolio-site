(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function Cloud(containerId, segmentMinWidth, segmentMaxWidth, maxHeight, color, scrollSpeed) {
  this.segmentWidthRange = [segmentMinWidth, segmentMaxWidth];
  this.maxHeight = maxHeight;
  this.color = color;
  this.containerId = containerId;
  this.speed = scrollSpeed;
  //coords are created on first update
}

Cloud.prototype.draw = function () {
  this.update();
  var s = Snap("#" + this.containerId + " svg");
  if (s.select('path')) {
    s.selectAll('path').remove(); //remove everything except defs
  }
  s.path({
    d: this.pathString,
    fill: "#FFF"
  });

  //requestAnimationFrame(this.draw.bind(this));
};

Cloud.prototype.update = function () {
  var speed = this.speed;
  var coords = this.coords;
  var containerWidth = document.getElementById(this.containerId).offsetWidth;
  var containerHeight = document.getElementById(this.containerId).offsetHeight;

  //new initCoordinates
  var segmentVariance = this.segmentWidthRange[1] - this.segmentWidthRange[0]; //max-min
  var heightVariance = this.maxHeight - 10; //random min height of 10 to account for shadow

  if (!this.coords) {
    //coords doesnt exist yet, so create a new set of coordinates
    var counter = 0;
    var coordsCurrentWidth = 0;

    coords = [];

    while (coordsCurrentWidth < containerWidth) {
      if (counter !== 0) {
        coordsCurrentWidth += Math.floor(Math.random() * segmentVariance) + this.segmentWidthRange[0];
        //random number in the variance added to the currentWidth
      }

      var _x = coordsCurrentWidth;
      var _y = Math.floor(Math.random() * heightVariance) + 10;
      coords.push([_x, _y]); //push coordinates to array
      counter++;
    }

    this.coords = coords;
  } else {

    //check if the last coordinate set it nearing the right edge of the container, then add a new element
    //move coordinates to the left
    coords.map(function (coord) {
      coord[0] -= speed; //subtract cloud.speed from all x coordinates
    });

    //remove/add new coordinates as needed
    if (coords[1] === 0) {
      coords.shift(); //remove first item if the second item's x value has reached the lefthand side
    }

    var lastItem = coords[coords.length - 1];
    var segmentMinWidth = this.segmentWidthRange[0];
    //if last item is approaching the end
    if (lastItem[0] - segmentMinWidth <= containerWidth) {
      var x = lastItem[0] += Math.floor(Math.random() * segmentVariance) + this.segmentWidthRange[0];
      var y = Math.floor(Math.random() * heightVariance) + 10;

      coords.push([x, y]);
    }
  }

  //create the svg pathstring
  var pathString = "";
  for (var i = 0; i < coords.length; i++) {
    var x = coords[i][0];
    var y = coords[i][1];
    if (!pathString) {
      pathString += "M " + x + " " + y;
    } else {
      pathString += "L " + x + " " + y;
    }
  }
  pathString += "L " + containerWidth + " " + containerHeight; //draw line to bottom right corner
  pathString += "L 0 " + containerHeight + " Z"; //draw line to bottom left corner, then close the shape.
  this.pathString = pathString;
};

module.exports = Cloud;

},{}],2:[function(require,module,exports){
"use strict";

var Cloud = require('./cloudBuilder');

//define cloud borders
var cloud1 = new Cloud("fg-clouds", 125, 125, 140, "#FFF", 1.2);
var cloud2 = new Cloud("bg-clouds1", 70, 125, 60, "#CCC", .8);
var cloud3 = new Cloud("bg-clouds2", 50, 100, 20, "#FFF", 0.1);

//draw clouds (also handles the animations)
cloud1.draw();
cloud2.draw();
cloud3.draw();

var createWindLine = require('./wind');

var windObj1 = {
    heightRange: 60,
    segmentWidth: {
        min: 300,
        max: 400
    },
    dashSize: 20,
    dashOffset: 10,
    dashesMin: 13,
    dashesMax: 18,
    strokeWidth: 6,
    strokeOpacity: 0.5
};

var windObj2 = {
    heightRange: 60,
    segmentWidth: {
        min: 120,
        max: 200
    },
    dashSize: 15,
    dashOffset: 10,
    dashesMin: 10,
    dashesMax: 13,
    strokeWidth: 5,
    strokeOpacity: 0.4
};

var windObj3 = {
    heightRange: 60,
    segmentWidth: {
        min: 120,
        max: 200
    },
    dashSize: 15,
    dashOffset: 5,
    dashesMin: 10,
    dashesMax: 13,
    strokeWidth: 4,
    strokeOpacity: 0.2
};

createWindLine(windObj1);
createWindLine(windObj2);
createWindLine(windObj3);

//parallax scrolling
var scrollPos = 0;

var parallaxElements = document.querySelectorAll(".scroll");

var siteHeader = document.querySelector('.site-header');

window.addEventListener('scroll', function (e) {
    scrollPos = window.scrollY;

    if (parallaxElements) {
        parallaxElements.forEach(function (el, index) {
            var transformProps = ""; //empty string for transformation properties

            //handle translating
            if (el.dataset.scrollSpeed) {
                var scrollSpeed = Number(el.dataset.scrollSpeed);
                var parallaxPos = -scrollPos * scrollSpeed;
                transformProps += "translateY(" + parallaxPos + "px) ";
            }

            if (el.dataset.scrollRotate) {
                var rotation = Number(scrollPos * el.dataset.scrollRotate);
                var maxRotation = Number(el.dataset.scrollMaxRotate);

                var actualRotation = rotation < maxRotation ? rotation : maxRotation;
                transformProps += "rotateX(" + actualRotation + "deg) ";
            }

            if (el.dataset.scrollFade) {
                var opacity = 1 - Number(scrollPos * el.dataset.scrollFade);
                el.style.opacity = opacity;
            }

            el.style.transform = transformProps;
        });
    }

    if (scrollPos > 0.5 * window.innerHeight) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }
});

//hide all headings/projects to start with the .invisible class
/*
const elementsToAnimateIn = document.querySelectorAll('.animate-in>*');
console.log(elementsToAnimateIn);

elementsToAnimateIn.forEach(function(el){
    el.style.visibility = "hidden";
    el.classList.add('invisible'); //make each element invisible
})

window.addEventListener('scroll', function(e) {
    elementsToAnimateIn.forEach(function(el){
        if(getElementOffset(el).top < (0.75*window.innerHeight)) {
            el.style.visibility = "visible";
            el.classList.remove('invisible');
        }
    });
});

function getElementOffset(el) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + window.pageYOffset - scrollPos,
    left: rect.left + window.pageXOffset - scrollPos,
  };
}*/

},{"./cloudBuilder":1,"./wind":3}],3:[function(require,module,exports){
"use strict";

var s = Snap("#windFrame");
var el = document.getElementById("windFrame");

var windWrap = el.getBoundingClientRect(); // get the bounding rectangle

////////////////

var segmentWidth = {
  min: 200,
  max: 300
};

function getRandomInterval(min, max) {
  var segmentWidthVariance = max - min;
  return Number((Math.random() * segmentWidthVariance).toFixed(0)) + min;
}

//scale is the relative size of the wind line, delay is how long until it begins
function createWindLine(lineObj) {

  var heightRange = lineObj && lineObj.heightRange ? lineObj.heightRange : 80;
  var segmentWidth = {
    min: lineObj && lineObj.segmentWidthMin ? lineObj.segmentWidthMin : 200,
    max: lineObj && lineObj.segmentWidthMax ? lineObj.segmentWidthMax : 300
  };
  var dashSize = lineObj && lineObj.dashSize ? lineObj.dashSize : 20;
  var dashOffset = lineObj && lineObj.dashOffset ? lineObj.dashOffset : dashSize;
  var dashesMin = lineObj && lineObj.dashesMin ? lineObj.dashesMin : 8;
  var dashesMax = lineObj && lineObj.dashesMax ? lineObj.dashesMax : 12;
  var strokeWidth = lineObj && lineObj.strokeWidth ? lineObj.strokeWidth : 8;
  var strokeOpacity = lineObj && lineObj.strokeOpacity ? lineObj.strokeOpacity : 1;

  //get random start coordinates
  var start = {
    x: 0, //Math.random()*windWrap.width*(0.3), //start is somewhere in the first third
    y: Math.random() * windWrap.height

    //get the upper and lower bounds of the height range
  };var height = {
    min: start.y - 0.5 * heightRange,
    max: start.y + 0.5 * heightRange

    //console.log(height);

    //get last X location
  };var endX = windWrap.width; //(0.75*windWrap.width)+ (Math.random()*windWrap.width*0.25);

  //console.log(endX);

  //init an array to hold the coordinates
  var coords = [[start.x, start.y]];
  //console.log(coords);
  //get coordinates to fill the line
  while (coords[coords.length - 1][0] < endX) {
    var x = coords[coords.length - 1][0] + getRandomInterval(segmentWidth.min, segmentWidth.max);
    var y = Math.random() * heightRange + height.min;
    coords.push([x, y]);
  }

  //console.log(coords);

  //start the path string
  var pathString = "M" + start.x + " " + start.y;

  for (var i = 1; i < coords.length; i++) {
    var lastPoint = coords[i - 1];
    var thisPoint = coords[i];

    var diff = thisPoint[0] - lastPoint[0];
    var curvePoint1 = lastPoint[0] + 0.4 * diff;
    var curvePoint2 = thisPoint[0] - 0.4 * diff;

    pathString += " C " + curvePoint1 + " " + lastPoint[1] + " " + curvePoint2 + " " + thisPoint[1] + " " + thisPoint[0] + " " + thisPoint[1];
  };

  var path = s.path(pathString);
  var pathLength = Snap.path.getTotalLength(path);

  var dashes = 8 + getRandomInterval(dashesMin, dashesMax);

  var dashArray = dashSize + "px";
  var dashedLineLength = dashes * dashSize + dashes * dashOffset;

  for (var i = 1; i < dashes; i++) {
    dashArray += " " + dashOffset + "px " + dashSize + "px";
    if (i == dashes - 1) {
      dashArray += " " + Math.ceil(pathLength) + dashedLineLength + "px";
    }
  }

  var offset = 0 - pathLength - dashedLineLength;

  path.attr({
    fill: "none",
    stroke: "#FFF",
    strokeWidth: strokeWidth,
    strokeDasharray: dashArray,
    strokeDashoffset: dashedLineLength + "px",
    opacity: strokeOpacity
  });

  setTimeout(function () {
    path.animate({ strokeDashoffset: offset + "px" }, 9000, mina.ease, function () {
      path.remove();
      createWindLine(lineObj);
    });
  }, Math.random() * 3000);
}

module.exports = createWindLine;

},{}]},{},[2]);
