

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
  let s = Snap("#" + this.containerId + " svg");
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
  let speed = this.speed;
  let coords = this.coords;
  let containerWidth = document.getElementById(this.containerId).offsetWidth;
  let containerHeight = document.getElementById(this.containerId).offsetHeight;

  //new initCoordinates
  let segmentVariance = this.segmentWidthRange[1] - this.segmentWidthRange[0]; //max-min
  let heightVariance = this.maxHeight - 10; //random min height of 10 to account for shadow

  if (!this.coords) {
    //coords doesnt exist yet, so create a new set of coordinates
    let counter = 0;
    let coordsCurrentWidth = 0;
    
    coords = [];

    while (coordsCurrentWidth < containerWidth) {
      if (counter !== 0) {
        coordsCurrentWidth += Math.floor(Math.random() * segmentVariance) + this.segmentWidthRange[0];
        //random number in the variance added to the currentWidth
      }

      let x = coordsCurrentWidth;
      let y = Math.floor(Math.random() * heightVariance) + 10;
      coords.push([x, y]); //push coordinates to array
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