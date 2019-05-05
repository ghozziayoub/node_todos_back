var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todoApp',{ useNewUrlParser: true },null);

module.exports = {mongoose};
