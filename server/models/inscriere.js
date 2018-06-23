var mongoose = require('mongoose');
var Inscriere = mongoose.model('Inscrieri', {//mongoose permite inserarea de validari
    unic: { //id unic telefon
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    _course:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
module.exports = {Inscriere};