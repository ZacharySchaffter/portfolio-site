const siteHeader = document.querySelector('.site-header');


window.addEventListener('scroll', function(e) {

    scrollPos = window.scrollY;

    if (scrollPos>(0.5*window.innerHeight)) {
        siteHeader.classList.add('scrolled');
    } else {
        siteHeader.classList.remove('scrolled');
    }


});


//Clouds
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
let bgCloud3Props = {
  fill : "rgba(255,255,255,0.2)",
  stroke: "rgba(255,255,255,0.25)",
  "stroke-width": 1
}
let fgCloud = new Line("fg-cloud", 150, 20, [0.775, 0.8], 300, fgCloudProps);
let bgCloud = new Line("bg-cloud-1", 120, 30, [0.69, 0.75], 290, bgCloudProps);
let bgCloud2 = new Line("bg-cloud-2", 100, 35, [0.676, 0.7], 270, bgCloud2Props);
let bgCloud3 = new Line("bg-cloud-3", 90, 40, [0.64, 0.67], 250, bgCloud3Props);

fgCloud.init();
bgCloud.init();
bgCloud2.init();
bgCloud3.init();

let btmFgCloud = new Line("btm-fg-cloud", 150, 20, [.5, .6], 300, fgCloudProps, true);
let btmBgCloud = new Line("btm-bg-cloud-1", 120, 30, [.4, .5], 300, bgCloudProps, true);
let btmBgCloud2 = new Line("btm-bg-cloud-2", 100, 35, [.3, .4], 300, bgCloud2Props, true);

btmFgCloud.init();
btmBgCloud.init();
btmBgCloud2.init();




//Nav Menu
let navMenu = require('./navigation-menu');
navMenu.navigationMenu;
navMenu.mobileNav;

//Contact Form
let contactForm = require('./contact-form');
contactForm;

//Stardrawing
var drawStars = require('./stars');

//draw the stars
drawStars("stars", 300, 1, 4);

//Toggle class
let navButton = document.querySelector('.toggle-nav');
let mobileNav = document.getElementById('mobile-nav');

/*
navButton.onclick = function() {
  console.log("Clicked");
  navButton.classList.toggle('active');
}
*/

//bind click handlers to all mobile nav anchor links




//parallax scrolling
let scrollPos = 0;

const parallaxElements = document.querySelectorAll(".scroll");





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


