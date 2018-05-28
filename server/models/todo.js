var mongoose = require('mongoose');
var Todo = mongoose.model('Todo', {//mongoose permite inserarea de validari
    text: {
        type:String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed:{
        type:Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    }
});
module.exports = {Todo};