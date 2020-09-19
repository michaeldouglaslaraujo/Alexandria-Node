const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/alexandria', 
    { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true});

module.exports = mongoose;