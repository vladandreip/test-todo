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
        trim:true
        
    },
    grupa:{
        type:String, 
        required:true,
        minlength:1,
        trim:true
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
