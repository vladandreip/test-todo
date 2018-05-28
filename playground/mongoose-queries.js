const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
var id = 'id-ul din baza de date';
//ObjectID.isValid();
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('Id not found');
    }
    console.log('Todo By Id', todo);
}).catch((e) => console.log(e));

User.findById('5b0bd3eb9116fbc807aa1c1f').then((user) => {
    console.log(JSON.stringify(user,undefined,2));
}, (e) => {
    console.log('Unable to fetch user', user);
});