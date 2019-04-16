/**
 * User Model
 */
var mongoose = require('mongoose');

// Schema Modeling
var Schema = mongoose.Schema;
var schema = new Schema({
    nombre: String,
    direccion: String,
    ubicacion: String
},
{
    collection: 'agencias'
});

var Agency = mongoose.model("agencia", schema);

module.exports = Agency;
