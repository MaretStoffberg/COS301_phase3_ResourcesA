/**
 * Created by Jaco-Louis on 2015/03/19.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://45.55.154.156:27017/Buzz');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connection to database was successful.");
});

//===================Simple testing using a schema example
// Create schema
var spacesSchema = mongoose.Schema({
    name: String
})
// Add method to schema
spacesSchema.methods.speak = function () {
    var moduleName = this.name
        ? "Module name is " + this.name
        : "I don't have a name"
   // console.log(moduleName);
}

// Compile schema into a model (class that constructs documents)
var Space = mongoose.model('Spaces', spacesSchema)
// create object of type Space
var cosTest = new Space({ name: 'test9' });
//cosTest.speak();

// Save cosTest to the database each time server is started
cosTest.save(function (err, cosTest) {
    if (err) return console.error(err);
    //cosTest.speak();
});

// Display all in Spaces model
Space.find(function (err, spaces) {
    if (err) return console.error(err);
    //console.log(spaces);
})