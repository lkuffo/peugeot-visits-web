/**
 * User Model
 */
var mongoose = require('mongoose');

// Schema Modeling
var Schema = mongoose.Schema;
var schema = new Schema({
    url:     String
},
{
    collection: 'images'
});

var Image = mongoose.model("image", schema);

module.exports = Image;
