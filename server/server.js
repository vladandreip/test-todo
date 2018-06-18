const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Curs} = require('./models/cursuri');
var {User} = require('./models/user');
var {Prezenta} = require('./models/prezenta');
const port = process.env.PORT || 3000; // -> setat daca este urcat pe heroku 
//mongodb permite salvarea documetelor de diferite forme in acceasi colectie. Mongoose permite organizarea acestora prin salvarea inregistrarilor respectand o schema

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });
// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc)
// }, (e) =>{
//     console.log('Unable to save todo',e);
// });//saves to the mongoDB
// var secondTodo = new Todo({
//     text: 'second',
//     completed: false,
//     completedAt: 1
// });
// secondTodo.save().then((doc) => {
//     console.log('Saved todo:', doc);
// }, (e) => {
//     console.log('Unable to save todo',e);
// })
// var user = new User({
//     email:'   gigi@gmail'
// });
// user.save().then((doc) => {
//     console.log('saved user', user);
// }, (e) => {
//     console.log('Unable to save user', user)
// })
var app = express();//stocheaza aplicatia express
app.use(bodyParser.json());//our application uses bodyParser middleware -> the return of bodyParser.json() is a function and that is the middleware that we need to give to express -> we can now send json to our express aplication
//body parser is going to take the json and convert it into an object, ataching it on to this request object
var authenticate = (req,res,next) => {
    var token = req.header('x-auth');//gets the header value. We need to pass the key to know which header we get
    User.findByToken(token).then((user) =>{//takes the token value and return the appropiate user related to that token 
        if(!user){
            return Promise.reject();//de asemenea se executa catch.ul de mai de jos
        }
       req.user = user;//atasez userul la request ca sa pot sa il trimit din app.get
       req.token = token; //atasez tokenul la request
       next();//apelez next ca sa se execute app.get de mai de jos
    }).catch((e) => {//se leaga de return  Promise.reject()
        //401 status inseamna "Authentication is required"
        res.status(401).send();
        //aici nu mai apelez next deoarece nu doresc sa se execute codul de mai jos
    });
}
app.post('/prezenta', authenticate, (req,res) => {
    var prezenta = new Prezenta({
        nume: req.body.nume,
        prenume: req.body.prenume,
        grupa:req.body.grupa,
        _creator: req.user._id
    });
    prezenta.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
})
app.post('/cursuri',authenticate, (req, res) => {//url si functia callback
    console.log(req.body); //body gets store by body-parser
    var curs = new Curs({
        text: req.body.text,
        _creator: req.user._id
    });
    curs.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});
app.get('/cursuri', authenticate, (req, res) => {
    Curs.find({//returneaza doar documentele care au acelasi id cu 
        _creator: req.user._id
    }).then((curses) => {
        res.send({curses});//le transmitem inapoi sub forma de obiect pentru ca sa putem adauga noi proprietati in cazul in care am fi avut nevoie
    }, (e)=>{
        res.status(400).send(e);
    })
});
app.get('/cursuri/:id', authenticate, (req, res) => {
    //req.params reprezinda valoarea id.ului din request
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send(); //return incheie executia
    }
    Curs.findOne({
        _id: id,
        _creator:req.user._id
    }).then((curs) =>{
        if(!curs){
            return res.status(404).send;
        }
        res.status(200).send({curs});
    }).catch((e) => {
        res.status(400).send();
    })
})
app.delete('/cursuri/:id',authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send;
    }
    Curs.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((curs) => {
        if(!curs){
            return res.status(404).send();
        }
        res.send(curs);
    }).catch((e) => {
        res.status(400).send();
    });
});
//patch -> update;
//trebuie modificat sa nu mai existe completed si completedAt
app.patch('/cursuri/:id',authenticate, (req,res) => {
    var id = req.params.id;
    //se face update doar la ce vrem noi -> text si completed
    var body = _.pick(req.body, ['text', 'completed']);//picks an array of proprieties that user is going to be able to update
    console.log(body);
    if(!ObjectID.isValid(id)){
        return res.status(400).send;
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
   Curs.findOneAndUpdate({_id:id,_creator:req.user._id}, {$set:body},{new:true}//new returneaza obiectul nou creat
   ).then((curs) => {
        if(!curs){
            return res.status(404).send();
        }
        res.send({curs});//same as {todo:todo}
   }).catch((e) => {
       res.status(400).send();
   })
})
//create users
app.post('/user', (req, res) => {
    var body = _.pick(req.body, ['email','password'])
    var newUser = new User(body);
    newUser.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(newUser);//custom header defined as x-auth(key value pair)
    }).catch((e) => {
        res.status(400).send(e);;
   })
});
//middleware function that we are going to use on our routes to make them private.The actual route is not going to run until next is called inside the middleware
// var authenticate = (req,res,next) => {
//     var token = req.header('x-auth');//gets the header value. We need to pass the key to know which header we get
//     User.findByToken(token).then((user) =>{//takes the token value and return the appropiate user related to that token 
//         if(!user){
//             return Promise.reject();//de asemenea se executa catch.ul de mai de jos
//         }
//        req.user = user;//atasez userul la request ca sa pot sa il trimit din app.get
//        req.token = token; //atasez tokenul la request
//        next();//apelez next ca sa se execute app.get de mai de jos
//     }).catch((e) => {//se leaga de return  Promise.reject()
//         //401 status inseamna "Authentication is required"
//         res.status(401).send();
//         //aici nu mai apelez next deoarece nu doresc sa se execute codul de mai jos
//     });
// }
//private route 
app.get('/users/me', authenticate, (req, res) =>{//uses the middleware from up above
    res.send(req.user);
    //req si res de aici sunt aceleasi ca cele definite in middleware
});
//LOGIN -> POST /users/login {email, password}
app.post('/users/login', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {//daca este o eroare, se leaga de catch.ul de mai jos
            res.header('x-auth', token).send(user);
        })
   }).catch((e) => {
        res.status(400).send();
   });
})
//logout
app.delete('/users/me/token',authenticate, (req,res) => {//sterge tokenul
    req.user.removeToken(req.token).then(() => {
        res.status(200).send;
    }, () => {
        res.status(400).send();
    });
});
app.listen(port, () => {//basic server
    console.log(`Started on port ${port}`);
});
//generateAuthToken method is going to be responsible for adding a token on an individual user document, saving that and returning the token  so we can send it back to the user
//private routes require an x-auth token, we are going to validate that token, find the user asociated with that token 
//req and res from the middleware are the same as from the app.get. next exists so you can tell express when your middleware function is done and this is usefull because you can have as much middleware as you want registered to a single express app. 
//On short -> the application will continue to run after you called next