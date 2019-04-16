/**
 * User Model
 */
var mongoose = require('mongoose');

// Schema Modeling
var Schema = mongoose.Schema;
var schema = new Schema({
    user:     String,
    password: String,
    type:     String,
},
{
    collection: 'users'
});

var User = mongoose.model("user", schema);

module.exports = User;
