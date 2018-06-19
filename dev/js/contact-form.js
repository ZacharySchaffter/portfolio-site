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
        console.log(this.name, this.email, this.message);
        axios.post('../submit.php', { name: self.name, email: self.email, message: self.message })
            .then(function(response){
                console.log('Message Sent');
                console.log(response);
                self.isSending = false;
            });  
    }
      
     
    },

    validEmail: function (email) {
        var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log("Checking Email: "+regexp.test(email));
        return regexp.test(email);
    }
  },

  
});

module.exports = contactForm;