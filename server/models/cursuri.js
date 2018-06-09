var mongoose = require('mongoose');
var Curs = mongoose.model('Curs', {//mongoose permite inserarea de validari
    text: {
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
module.exports = {Curs};