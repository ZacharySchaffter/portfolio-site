

function drawStars(svgId, numOfStars, minSize, maxSize){
  let x = 0;
  let y = 0;
  let segment = Math.ceil(Math.sqrt(numOfStars));

  let draw = SVG(svgId);
  
  let domNode = document.getElementById(svgId);
  let width = domNode.getBoundingClientRect().width;
  let height = domNode.getBoundingClientRect().height;
  
  let widthSegment = width/segment;
  let heightSegment = height/segment;
  
  
  let starSize;
  
  for (var i = 0; i<= width; i+=widthSegment){
    for (var k = 0; k<= height; k+=heightSegment){
        starSize = minSize + Math.random()*(maxSize-minSize);
        x = i+(1-Math.random()*widthSegment);
        y = k+(1-Math.random()*heightSegment);
        let circle = draw.circle(starSize);
        circle.attr({
          cx : x,
          cy : y,
          fill:"rgba(255,255,255,"+Math.random().toFixed(2)+")",
        });   
    }    
  }
};

module.exports = drawStars;

