
let s = Snap("#windFrame");
let el = document.getElementById("windFrame");

let windWrap = el.getBoundingClientRect(); // get the bounding rectangle

////////////////

let segmentWidth = {
  min : 200,
  max : 300
};

function getRandomInterval(min, max){
  let segmentWidthVariance = max-min;
  return Number((Math.random() * segmentWidthVariance).toFixed(0)) + min;
}



//scale is the relative size of the wind line, delay is how long until it begins
function createWindLine(lineObj){
  
  let heightRange = lineObj && lineObj.heightRange ? lineObj.heightRange : 80;
  let segmentWidth = {
    min: lineObj && lineObj.segmentWidthMin ? lineObj.segmentWidthMin : 200,
    max: lineObj && lineObj.segmentWidthMax ? lineObj.segmentWidthMax : 300
  }
  let dashSize = lineObj && lineObj.dashSize ?  lineObj.dashSize : 20;
  let dashOffset = lineObj && lineObj.dashOffset ? lineObj.dashOffset : dashSize;
  let dashesMin = lineObj && lineObj.dashesMin ? lineObj.dashesMin : 8;
  let dashesMax = lineObj && lineObj.dashesMax ? lineObj.dashesMax : 12;
  let strokeWidth = lineObj && lineObj.strokeWidth ? lineObj.strokeWidth : 8;
  let strokeOpacity = lineObj && lineObj.strokeOpacity ? lineObj.strokeOpacity : 1;
  
  
  //get random start coordinates
  let start = {
    x : 0,//Math.random()*windWrap.width*(0.3), //start is somewhere in the first third
    y : Math.random()*windWrap.height
  }
  
  
  //get the upper and lower bounds of the height range
  let height = {
    min : start.y-(0.5*heightRange),
    max : start.y+(0.5*heightRange)
  }
  
  //console.log(height);
  
  //get last X location
  let endX = windWrap.width;//(0.75*windWrap.width)+ (Math.random()*windWrap.width*0.25);
 
  //console.log(endX);
  
  //init an array to hold the coordinates
  let coords = [
    [start.x, start.y]
  ];
   //console.log(coords);
  //get coordinates to fill the line
  while (coords[coords.length-1][0] < endX) {
    let x = coords[coords.length-1][0]+getRandomInterval(segmentWidth.min, segmentWidth.max);
    let y = Math.random()*heightRange+height.min;
    coords.push([x,y]);
  }
  
  //console.log(coords);
  
  //start the path string
  var pathString = "M"+start.x+" "+start.y;
  
  for (var i = 1; i<coords.length; i++){
    let lastPoint = coords[i-1];
    let thisPoint = coords[i];
    
    let diff = thisPoint[0] - lastPoint[0];
    let curvePoint1 = lastPoint[0] + (0.4*diff);
    let curvePoint2 = thisPoint[0] - (0.4*diff);
    
    pathString += " C "+curvePoint1+" "+lastPoint[1]+" "+curvePoint2+" "+thisPoint[1]+" "+thisPoint[0]+" "+thisPoint[1];
  };
     
  let path = s.path(pathString);
  let pathLength = Snap.path.getTotalLength(path);
  
  
  let dashes = 8 + getRandomInterval(dashesMin, dashesMax);
   
  let dashArray = dashSize+"px";
  let dashedLineLength = (dashes*dashSize)+(dashes*dashOffset);
  
  for (var i = 1; i<dashes; i++){
    dashArray += " "+dashOffset+"px "+dashSize+"px";
    if (i==dashes-1){
       dashArray += " "+Math.ceil(pathLength)+(dashedLineLength)+"px"; 
    }
  }
  
  let offset = 0 - pathLength - dashedLineLength;

  path.attr({
    fill: "none",
    stroke: "#FFF",
    strokeWidth: strokeWidth,
    strokeDasharray: dashArray,
    strokeDashoffset: dashedLineLength+"px",
    opacity: strokeOpacity
  });
  
  setTimeout(
    function(){
      path.animate({strokeDashoffset:offset+"px"}, 9000, mina.ease, function(){
        path.remove();
        createWindLine(lineObj);
      });
    },  Math.random()*3000)

  
    
}


module.exports = createWindLine;