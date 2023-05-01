const Member = require('../../models/member.model');

exports.create = member => {
    const newMember = new Member(member);
    return newMember.save();
};


exports.findAll = () => Member.find();


exports.findById = id => Member.findById(id);


exports.update = (id, memberData) => Member.findByIdAndUpdate(id, memberData, {new: true});


exports.delete = id => Member.findByIdAndRemove(id);