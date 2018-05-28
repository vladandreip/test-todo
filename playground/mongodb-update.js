const {MongoClient, ObjectID} = require('mongodb');
var user = {name: 'andrew', age:25};
var {name} = user;
console.log(name);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
    if(err){
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDb server');
    //in find introducem campul dupa care dorim sa realizam interogarea
    //cursorul are o gramada de metode care sunt detaliate in documentatie 
    db.collection('Todos').find({completed: false}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });//cursor, pointer catre document , toArray le introduce intr un array si reprezinta un promise
    //db.close(); 
   db.collection('Todos').findOneAndUpdate({
       _id: 
   })
});
