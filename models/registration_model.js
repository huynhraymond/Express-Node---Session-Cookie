

var mongoose = require('mongoose');

/*
 function regexPassword(value){
 return /^(?=.*\d)(?=.*[a-zA-Z]).{4,8}$/i.test(value);
 };  */

function regexPassword(pw) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$///i.test(pw);
}

function regexLogin(email) {
    return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email);
}

var RegistrationModel = mongoose.model('registration', {
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        validate: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    },

    password: {
        type: String,
        required: true,
        validate: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$///i
    }
});

module.exports = RegistrationModel;

