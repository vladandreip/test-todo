var mongoose = require('mongoose');
const validator = require('validator');
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
    },
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
        trim:true
        
    },
    email:{
        default: 'default',
        required:true,
        type: String,
        trim:true,
        minlength:1,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    }
});
module.exports = {Inscriere};