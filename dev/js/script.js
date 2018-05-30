const Line = require('./cloudBuilder');

//Id of the svg element to draw in, the width in % between points, an array containing the varying original heights of the points (in fractions of an integer), and the curvature of the points in pixels.
//id of the svg, the number of points, the curvature, the height array, the force distance, and the svg properties
let fgCloudProps = {
  fill : "#FFF",
  stroke: "rgba(255,255,255,0.8)",
  "stroke-width": 4
}
let bgCloudProps = {
  fill : "rgba(255,255,255,0.4)",
  stroke: "rgba(255,255,255,0.5)",
  "stroke-width": 3
}
let bgCloud2Props = {
  fill : "rgba(255,255,255,0.3)",
  stroke: "rgba(255,255,255,0.35)",
  "stroke-width": 2
}
let fgCloud = new Line("fg-cloud", 150, 20, [0.775, 0.8], 300, fgCloudProps);
let bgCloud = new Line("bg-cloud-1", 120, 30, [0.69, 0.75], 300, bgCloudProps);
let bgCloud2 = new Line("bg-cloud-2", 100, 35, [0.676, 0.7], 300, bgCloud2Props);

fgCloud.init();
bgCloud.init();
bgCloud2.init();


//contact form submission stuff
let popupNode = document.querySelector(".popup__wrap");
let body = document.body;
let popupVisibleClass = "popup-is-visible"

//Stardrawing
var drawStars = require('./stars');

//draw the stars
drawStars("stars", 300, 1, 4);

//

var request = require('request');
/*request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/


//parallax scrolling
let scrollPos = 0;

const parallaxElements = document.querySelectorAll(".scroll");

const siteHeader = document.querySelector('.site-header');


window.addEventListener('scroll', function(e) {

    scrollPos = window.scrollY;
    
    if (parallaxElements) {
        parallaxElements.forEach(function(el,index){
            let transformProps = "";//empty string for transformation properties

            //handle translating
            if (el.dataset.scrollSpeed) {
                let scrollSpeed = Number(el.dataset.scrollSpeed);
                let parallaxPos = (-(scrollPos)*scrollSpeed).toFixed(0);
                console.log(parallaxPos);
                transformProps += "translateY("+parallaxPos+"px) ";
            }

            if (el.dataset.scrollRotate) {
                let rotation = Number(scrollPos*el.dataset.scrollRotate);
                let maxRotation = Number(el.dataset.scrollMaxRotate);

                let actualRotation = rotation < maxRotation ? (rotation).toFixed(0) : maxRotation;
                transformProps += "rotateX("+actualRotation+"deg) ";


            }

            if (el.dataset.scrollFade){
                let opacity = 1-Number(scrollPos*el.dataset.scrollFade);
                el.style.opacity = opacity;
            }
            
            el.style.transform = transformProps;
        })  
    }

    if (scrollPos>(0.5*window.innerHeight)) {
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


