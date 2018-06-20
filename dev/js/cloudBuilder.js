//Id of the svg element to draw in
//the width in pixels between points
//the curvature of the points in pixels.
//an array containing the varying original heights of the points (in fractions of an integer)
//Distance in pixels at which the mousecursor affects the points
//an object of various properties
function Line(svgId, segmentWidth, curvature, heightArr, sphereOfInfluence, svgAttr, isStatic) {
  this.svgEl = SVG(svgId);//initialize the svg
  this.svgPath = this.svgEl.path("M0,0");
  
  //Pass the properties to the svgpath
  this.svgPath.attr(svgAttr);
  this.isStatic = isStatic; //boolean, true makes it not interactive
  this.domNode = document.getElementById(svgId);
  this.width = this.domNode.getBoundingClientRect().width;
  this.height = this.domNode.getBoundingClientRect().height;
  this.nodes = [];
  this.soi = sphereOfInfluence;
  this.curvature = curvature;
  this.segmentWidth = segmentWidth;
  this.heightArr = heightArr;

  this.mouseX = null;
  this.mouseY = null;
  
  this.isMovable = true; //this gets toggled when resizing to temporarily stop the frames.

  
}

//Initialize the line object
Line.prototype.init = function(){
  var obj = this;
  this.createNodes();

  //start the animation frames
  window.requestAnimationFrame(this.step.bind(this)); 

  if(!this.isStatic){
    //bind event handlers
    document.addEventListener("mousemove", obj.handleMouseMove.bind(obj));
    document.addEventListener("mouseout", obj.handleMouseOut.bind(obj));
  }
  

  //resize function, keep it throttled
  (function() {
    window.addEventListener("resize", resizeThrottler, false);
    var resizeTimeout;
    function resizeThrottler() {
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if ( !resizeTimeout ) {
        resizeTimeout = setTimeout(function() {
          resizeTimeout = null;
          actualResizeHandler();
      
         }, 200);
      }
    }

    function actualResizeHandler() {
      obj.resize();
    }

  }());

  this.resize();
};

Line.prototype.createNodes = function(){
  let heightInd = 0;
  let lineObj = this;
  this.numOfNodes = Math.floor(this.width/this.segmentWidth)
  this.trueSegmentWidth = this.width/(this.numOfNodes); //recalc the segment width based on node amount

  for (var i=0; i<this.numOfNodes+2; i++){
    let x = i*this.trueSegmentWidth - (0.5*this.trueSegmentWidth);
    let y = this.heightArr[heightInd]*this.height;
    
    heightInd++;
    if (!this.heightArr[heightInd]) {
      heightInd = 0;
    }
    let circle = this.svgEl.circle(0);
    
    if (lineObj.nodes[i]){
      let thisSphere = lineObj.nodes[i];
      thisSphere.centerX = x;
      thisSphere.centerY = y;
    } else {
      let sphere = new Sphere(circle, x, y, this.soi);
      this.nodes.push(sphere);
    }
  }
}

//Method to calculate the new node positions and redraw the line
Line.prototype.step = function(){

  this.isAnimating = true;
  var obj = this;
  
  let coords = [];
  let x, y;
  let nextPoint;
   
  let pathString = "M"+this.nodes[0].currentX + " " + this.nodes[0].currentY;  //first element is where it starts.
  
  let trueY = window.scrollY + obj.mouseY;
  //Move each of the nodes
  this.nodes.forEach(function(el, ind, arr){
    el.move(obj.mouseX, trueY);
    x = el.currentX;
    y = el.currentY;
    nextPoint = arr[ind+1];
    
    //if the next point exists, add the curves and node point
    if (nextPoint){
      //for each point, we're really adding the curve points between this and then the next node
      /*pathString +=  " C "+ (x+obj.curvature) +" "+ y +", "; //first curve point
      pathString += (nextPoint.currentX - obj.curvature) +" "+ nextPoint.currentY +", "; //second curve point
      pathString += nextPoint.currentX +" "+ nextPoint.currentY; //next actual node*/
      
      pathString += "L"+nextPoint.currentX +" "+ nextPoint.currentY; //next actual node
    }
  });
  
  //end the pathstring
  pathString += " L "+ this.width+ " " + this.height*3 +" L 0 " + this.height*3;
  
  //redraw the svg line by modifying its attribute
  this.svgPath.attr({
    d : pathString
  });
  
  //Request the next animation frame
  this.isAnimating = false;

  if (!this.isStatic){
    setTimeout(function(){
      window.requestAnimationFrame(obj.step.bind(obj));
    }, 15);
  }
  
  
}

Line.prototype.resize = function() {
  //resize the line and calc new current positions for the nodes
  //First set the isMovable prop to false so the animationFrames stop
  //Then, recalc element width, and add any new nodes if the screen got bigger, ditch them if the screen got smaller.
  let origWidth = this.width;
  let origHeight = this.height;
  this.width = this.domNode.getBoundingClientRect().width;
  this.height = this.domNode.getBoundingClientRect().height;
  
  let obj = this;
  let relX, relY, relCenterX, relCenterY;
  this.nodes.forEach(function(el){
    relX = el.currentX / origWidth;
    relY = el.currentY / origHeight;
    relCenterX = el.centerX /origWidth;
    relCenterY = el.centerY / origHeight;
    //reset coordinates
    el.currentX = relX * obj.width;
    el.currentY = relY * obj.height;
    el.centerX = relCenterX * obj.width;
    el.centerY = relCenterY * obj.height;
    
    el.svgEl.attr({
      cx : el.currentX,
      cy : el.currentY
    });
  });
  
  //redraw.  
  if (this.isStatic){
    this.step();//restart it
  }
  
}

Line.prototype.handleMouseMove = function(evt){
  this.mouseX = evt.clientX;
  this.mouseY = evt.clientY;
};


Line.prototype.handleMouseOut = function(evt){
  this.mouseX = null;
  this.mouseY = null;
};

function Sphere(el, x, y, forceDistance){
  this.svgEl = el;
  this.centerX = parseFloat(x.toFixed(0)); //original center coordinate
  this.centerY = parseFloat(y.toFixed(0));  //original center coordinate
  this.currentX = parseFloat(x.toFixed(0)); //current center point
  this.currentY = parseFloat(y.toFixed(0)); //current center point 
  this.forceDistance = forceDistance;
  
  //this is the circle node on the line
  this.svgEl.attr({
    cx : this.currentX,
    cy : this.currentY
  });
}
//method to move the sphere, pass it the x,y of the mouse coordinates
Sphere.prototype.move = function(mouseX, mouseY) {

  if (!mouseX || !mouseY) { //the mouse either hasnt entered, or it's been taken off the document
    this.animateBackToCenter();
    return;
  }
    
   let posRelativeToMouse = {
     x : this.currentX - parseInt(mouseX),
     y : this.currentY - parseInt(mouseY)
   };
     
  let distance = Math.sqrt(posRelativeToMouse.x * posRelativeToMouse.x + posRelativeToMouse.y * posRelativeToMouse.y);
  let forceDirection = {
    x: posRelativeToMouse.x / distance,
    y: posRelativeToMouse.y / distance,
  };
  
  let maxDistance = Number(this.forceDistance);

  // convert (0...maxDistance) range into a (1...0).
  // Close is near 1, far is near 0
  let force = (maxDistance - distance) / maxDistance;
  // if we went below zero, set it to zero.
  if (force < 0) {
    force = 0;
    this.animateBackToCenter();
    
  } else {
    this.currentX = this.svgEl.attr("cx");
    this.currentY = this.svgEl.attr("cy");   
  }
  
  this.currentX += forceDirection.x * force * 3;
  this.currentY += forceDirection.y * force * 3;
  
  this.svgEl.attr({
    cx : this.currentX, 
    cy : this.currentY
  })
}

//function to animate circle back to original center
Sphere.prototype.animateBackToCenter = function(){
  if (this.currentX == this.centerX && this.currentY == this.centerY){
    return;
  }
  
  let posRelativeToCenter = {
     x : this.centerX - this.currentX,
     y : this.centerY - this.currentY
   };
  
  let distance = Math.sqrt(posRelativeToCenter.x * posRelativeToCenter.x + posRelativeToCenter.y * posRelativeToCenter.y);
  
  if (distance < 1) {
    this.currentX = this.centerX;
    this.currentY = this.centerY;

    this.svgEl.attr({
      cx : this.currentX, 
      cy : this.currentY
    });
    return;
  }
  
  let forceDirection = {
    x: posRelativeToCenter.x / distance,
    y: posRelativeToCenter.y / distance,
  };
  
  //let vel = 100 < distance ? 100 : distance ;
  var force = distance / 50;
  
  this.currentX += forceDirection.x * force * 1;
  this.currentY += forceDirection.y * force * 1;
  
  /*this.svgEl.attr({
    cx : this.currentX, 
    cy : this.currentY
  })*/
  
   
};


module.exports = Line;

