const Message = require('../../models/message.model');
const Member = require('../../models/member.model');

exports.create = message => {
    const newMessage = new Message(message);
    return newMessage.save()
    .then(()=> Member.findById(message.sender))
    .then(sender => {
        sender.messages.push(newMessage._id);
        return sender.save();
    })
    .then( () => newMessage)
};


exports.findAll = () => Message.find().populate('sender', {name: 1});


exports.findById = id => Message.findById(id).populate('sender');


exports.update = (id, messageData) => Message.findByIdAndUpdate(id, messageData, {new:true});
