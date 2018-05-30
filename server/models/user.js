const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _= require('lodash');
const bcrypt = require('bcryptjs');
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
UserSchema.statics.findByCredentials = function(email, password){
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err,res) => {
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });
    });
}
var User = mongoose.model('User',UserSchema);



UserSchema.pre('save', function(next){//folosim functie ca sa putem utiliza this
    var user = this;
    if(user.isModified('password')){//daca se modifica parola dorim sa o hash.uim si sa o stocam. Folosim acest lucru deoarece de exemplu putem modifica mailul => se executa codul pre si se hashuieste parola hashuita si nu dorim acest lucru. Asa ca modificam parola doar atunci cand este nevoie(atunci cand se schimba -> update)
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})//run code before the save event 
module.exports = {User};
//UserSchema.statics -> model method
//UserSchema.methods -> instance methods 