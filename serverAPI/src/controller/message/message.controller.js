const createError = require('http-errors');
const messageService = require('./message.service');
const logger = require('../../config/logger');
const Message = require('../../models/message.model');

//CREATE
exports.create = async (req, res, next) => {
    
    const validationErrors = new Message(req.body).validateSync();
    if(validationErrors) {
        return next(new createError.BadRequest(validationErrors));
    }

    const newMessage = {
        sender: req.body['sender'],
        messageText: req.body['messageText'],
        opened: false
    };

    try {
        const savedMessage = await messageService.create(newMessage);
        logger.info(`New message sent to admin`);
        res.status(201).json(savedMessage);
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Message could not be sent'));
    }
}


//READ - get all messages
exports.findAll = async (req, res, next) => {
    logger.debug(`${new Date().toUTCString()}, METHOD: ${req.method}, path:${req.originalUrl}`)
    try{
        const messageList = await messageService.findAll();
        res.json(messageList);
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Database error'));
    }
}


//READ one message
exports.findById = async (req, res, next) => {
    const messageId = req.params.id;
    logger.debug(`${new Date().toUTCString()}, METHOD: ${req.method}, path:${req.originalUrl}` +
        ` Get one message with id: ${messageId}`);

    try{
        let message = await messageService.findById(messageId);
        if(!message) return next(new createError.NotFound(`Message with ${messageId} is not found`))
        res.json(message);

    }catch(err){
        logger.error(err);
        if(err.kind === "ObjectId") return next(new createError.BadRequest(`Invalid ObjectId: ${messageId}`));
        return next(new createError.InternalServerError('Database error'));
    }
}


//UPDATE - admin has opened the message
exports.update = async (req, res, next) => {
    logger.info(
        `A new ${req.method}, request has been sent at ${new Date().toUTCString()}, path: ${req.url}`
      );
    const messageId = req.params.id;

    try{
        let message = await messageService.findById(messageId);
        if(!message) return next(new createError.NotFound(`Message with ${messageId} is not found`))
        
        const messageOpened = {
            sender: message.sender,
            messageText: message.messageText,
            opened: true
        }
        const updatedMessage =  await messageService.update(messageId, messageOpened);
        res.json(updatedMessage);

    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError(`Could not open message with id ${messageId}`));
    }
}

