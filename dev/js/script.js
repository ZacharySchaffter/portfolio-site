const Cloud = require('./cloudBuilder');

//define cloud borders
let cloud1 = new Cloud("fg-clouds", 125, 125, 140, "#FFF", 1.2);
let cloud2 = new Cloud("bg-clouds1", 70, 125, 60, "#CCC", .8);
let cloud3 = new Cloud("bg-clouds2", 50, 100, 20, "#FFF", 0.1);

//draw clouds (also handles the animations)
cloud1.draw();
cloud2.draw();
cloud3.draw();

let createWindLine = require('./wind');

let windObj1 = {
  heightRange:60,
  segmentWidth: {
    min: 300,
    max: 400
  },
  dashSize : 20,
  dashOffset: 10,
  dashesMin : 13,
  dashesMax : 18,
  strokeWidth: 6,
  strokeOpacity:0.5
};

let windObj2 = {
  heightRange:60,
  segmentWidth: {
    min: 120,
    max: 200
  },
  dashSize : 15,
  dashOffset: 10,
  dashesMin : 10,
  dashesMax : 13,
  strokeWidth: 5,
  strokeOpacity:0.4
};

let windObj3 = {
  heightRange:60,
  segmentWidth: {
    min: 120,
    max: 200
  },
  dashSize : 15,
  dashOffset: 5,
  dashesMin : 10,
  dashesMax : 13,
  strokeWidth: 4,
  strokeOpacity:0.2
};

createWindLine(windObj1);
createWindLine(windObj2);
createWindLine(windObj3);

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
                let parallaxPos = -(scrollPos)*scrollSpeed;
                transformProps += "translateY("+parallaxPos+"px) ";
            }

            if (el.dataset.scrollRotate) {
                let rotation = Number(scrollPos*el.dataset.scrollRotate);
                let maxRotation = Number(el.dataset.scrollMaxRotate);

                let actualRotation = rotation < maxRotation ? rotation : maxRotation;
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


