let axios = require('Axios');

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

let contactForm = new Vue({
  el: '#contactForm',
  data: {
    name : "",
    email: "",
    message:"",
    errors: {},
    isSending: false
  },
  methods:{
    checkForm: function (e) {
     e.preventDefault(); //prevent form from firing  

    this.errors = {};

    if (!this.name) {
        this.errors.name = 'Name required.';
    }
    if (!this.email) {
        this.errors.email = 'Email required.';
    } else if (!this.validEmail(this.email)) {
        this.errors.email = 'Valid email required.';        
    }
    if (!this.message){
        this.errors.message = "Message required";
    }

    //check if errors object is empty
    if (isEmpty(this.errors)) {
        //Send data via post
        let self = this;
        this.isSending = true;

        //AXIOS...*shakes fist*
        const data = new FormData();

        data.append('name', this.name);
        data.append('email', this.email);
        data.append('message', this.message);

        axios.post('../submit.php', data)
        .then(function(response){
            self.isSending = false;
        });  
    }
      
     
    },

    validEmail: function (email) {
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    }
  },

  
});

module.exports = contactForm;