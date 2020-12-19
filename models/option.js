/**
 * User Model
 */
var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://admin:peugeotLeads123@cluster0.fhm8x.mongodb.net/peugeot-visits?retryWrites=true&w=majority`);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Schema Modeling
var Schema = mongoose.Schema;
var schema = new Schema({
    type: String,
    subtype: String,
},
{
    collection: 'options'
});

var Option = mongoose.model("option", schema);

module.exports = Option;
