const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _= require('lodash');
//we are using a Schema to be able to implement custom methods
var UserSchema = new mongoose.Schema({//defines a schema for a user
    email:{
        default: 'cacat',
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
    password: {
        type:String, 
        require:true,
        minlength:6
    },
    tokens: [{
        access:{
            type: String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }] 
});
//UserSchema.methods permite depozitarea metodelor
UserSchema.methods.toJSON = function(){//determines what data to send back.(we want to send back the id and the email after the request)
    //toJson reprezinta o metoda suprascrisa ce este apelata in momentul in care trimitem mai departe obiectul catre express ca raspuns
    var user = this;
  
    //var userObject = user.toObject();//user.toObject is responsible for taking your mongoose variable 'user' and converting it into a regular object where only the proprieties available in the document exist
    
    return _.pick(user, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth'
    var token = jwt.sign({_id: user._id, access}, 'abc123').toString();//toHexString -> passes the string value as apposed to the object id
  
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });

};
UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'abc123');
    }catch(e){
        return Promise.reject()//prin return nu se mai executa niciodata ce este mai jos si anume User.findOne...
    }
    return User.findOne({
        _id: decoded._id,//puteam folosi quotes si aici dar nu este obligatoriu
        'tokens.token':token, //to query a nested document we use quotes. Quotes are required when using a dot in the value
        'tokens.access':'auth'
    })
};
var User = mongoose.model('User',UserSchema);
module.exports = {User};
//UserSchema.statics -> model method
//UserSchema.methods -> instance methods 