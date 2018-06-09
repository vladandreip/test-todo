var mongoose = require('mongoose');
var Prezenta = mongoose.model('Prezenta', {
    nume: {
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    prenume: {
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
module.exports = {Prezenta};