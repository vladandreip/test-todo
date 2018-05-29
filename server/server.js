const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var Todo = require('./models/todo').Todo;
var {User} = require('./models/user');
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
app.post('/todos', (req, res) => {//url si functia callback
    console.log(req.body); //body gets store by body-parser
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});//le transmitem inapoi sub forma de obiect pentru ca sa putem adauga noi proprietati in cazul in care am fi avut nevoie
    }, (e)=>{
        res.status(400).send(e);
    })
});
app.get('/todos/:id', (req, res) => {
    //req.params reprezinda valoarea id.ului din request
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send(); //return incheie executia
    }
    Todo.findById(id).then((todo) =>{
        if(!todo){
            return res.status(404).send;
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
})
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(400).send;
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send();
    });
});
//patch -> update;
app.patch('/todos/:id', (req,res) => {
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
   Todo.findByIdAndUpdate(id, 
       {$set:body},
       {new:true}//new returneaza obiectul nou creat
   ).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});//same as {todo:todo}
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

app.listen(port, () => {//basic server
    console.log(`Started on port ${port}`);
});
//generateAuthToken method is going to be responsible for adding a token on an individual user document, saving that and returning the token  so we can send it back to the user