/**
 * User Model
 */
var mongoose = require('mongoose');

mongoose.connect(`mongodb://lkuffo:peugeotLeads123@ds139956.mlab.com:39956/peugeot-visits`);

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
