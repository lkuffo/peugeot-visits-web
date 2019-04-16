/**
 * Instance Model.
 */
// Registry Connection
var mongoose = require('mongoose');

// Schema Modeling
var Schema = mongoose.Schema;

var schema = new Schema({
    agency:        String,
    type:          String,
    subtype:       String,
    createdAt:     Date
},
    {
        collection: 'visits'
    }
);

var Visit = mongoose.model("visit", schema);
module.exports = Visit;
