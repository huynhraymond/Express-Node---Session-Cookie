
var mongoose = require('mongoose');

var SessionModel = mongoose.model('session', {
    userId: {
        type: String,
        required: true
    },

    name: String,
    email: String,
    expires: {
        type: Number,
        required: true
    }
});

module.exports = SessionModel;


