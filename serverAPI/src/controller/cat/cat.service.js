const Cat = require('../../models/cat.model');

exports.create = cat => {
    const newCat = new Cat(cat);
    return newCat.save();
};


exports.findAll = () => Cat.find();


exports.findById = id => Cat.findById(id);


exports.update = (id, catData) => Cat.findByIdAndUpdate(id, catData, {new:true});


exports.delete = id => Cat.findByIdAndRemove(id);