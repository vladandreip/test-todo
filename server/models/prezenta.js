var mongoose = require('mongoose');
const validator = require('validator');
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
        trim:true
        
    },
    grupa:{
        type:String, 
        required:true,
        minlength:1,
        trim:true
    },
    email:{
        default: 'default',
        required:true,
        type: String,
        trim:true,
        minlength:1,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    data:{
        type:Number,
        required:true
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _course:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
module.exports = {Prezenta};
