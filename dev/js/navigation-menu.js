//Navigation source data
let source = {
  navItems : [
    {
      name: "work",
      url: "#work",
    },
    {
      name: "social",
      url: "#social-media",
    },
    {
      name: "contact",
      url: "#contactForm",
    }
  ],

  mobileNavIsShown : false
};

let navigationMenu = new Vue({
  el : '#mainNavigation',
  data : source,
  methods:{
    toggleNav : function(){
      source.mobileNavIsShown = !source.mobileNavIsShown;
    }
  }
});

let mobileNav = new Vue({
  el : '#mobileNav',
  data : source,
  methods:{
    toggleNav : function(){
      source.mobileNavIsShown = !source.mobileNavIsShown;
    }
  }
})

module.exports = {
  navigationMenu,
  mobileNav
};