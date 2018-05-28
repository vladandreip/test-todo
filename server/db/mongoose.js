var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //pentru a folosi promisiuni si nu callbackuri
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose: mongoose
}