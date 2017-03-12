let mongoose = require('mongoose');

// create a model class
let contactSchema = mongoose.Schema({
    name: String,
    number: Number,
    email: String
},
{
  collection: "contactlist"
});

module.exports = mongoose.model('contactlists', contactSchema);
