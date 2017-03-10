let mongoose = require('mongoose');

// create a model class
let contactSchema = mongoose.Schema({
    name: String,
    rating: Number,
    cost: Number
},
{
  collection: "contactlist"
});

module.exports = mongoose.model('contactlist', contactSchema);
