const MongoClient = require('mongodb').MongoClient;//creaza un client mongo
//const {MongoClient} =  require('mongodb');//destructuring
//baza de date TodoApp se creaza automat atunci cand adaugam date 
var user = {name: 'andrew', age:25};
var {name} = user;
console.log(name);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDb server'); //folosim return pentru a parcurge mai departe
    }
    console.log('Connected to MongoDb server');
    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));//undefined pentru functia de filtrare si 2 se foloseste la filtrare
    });//
    db.close(); 
});//primul parametru este locatia bazei de date. Al doilea parametru este o functie callback care va fi apelata atunci cand se realizeaza conexiunea
