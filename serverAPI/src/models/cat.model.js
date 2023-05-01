const mongoose = require('mongoose');

const CatSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Cat must have a name'],
        minLength: 3
    },
    sex: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    description: String,
    imgUrl: String,
    adoptable: Boolean
}, {timestamps: true});

module.exports = mongoose.model('Cat', CatSchema, 'cats');
