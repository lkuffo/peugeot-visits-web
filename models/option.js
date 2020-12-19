/**
 * User Model
 */
var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://admin:peugeotLeads123@cluster0.fhm8x.mongodb.net/peugeot-visits`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).catch((err) => {
    console.log(err);
});

var db = mongoose.connection;
db.on('error', (err) => console.log(err));

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
