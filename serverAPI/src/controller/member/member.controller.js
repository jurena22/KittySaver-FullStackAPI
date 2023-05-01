const memberService = require('./member.service');
const createError = require('http-errors');
const logger = require('../../config/logger');
const Member = require('../../models/member.model');


//CREATE - save a new member
exports.create = async (req, res, next) => {
    const validationErrors = new Member(req.body).validateSync();
    if(validationErrors) {
        return next(new createError.BadRequest(validationErrors));
    }
    
    const newMember = {
        name: req.body['name'],
        phoneNumber: req.body['phoneNumber'],
        address: req.body['address'],
        email: req.body['email'],
        password: req.body['password'],
        role: 'MEMBER'
    };

    try {
        const savedMember = await memberService.create(newMember);
        logger.info(`New member saved`);
        res.status(201).json(savedMember);
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Member could not be saved'));
    }
}


//READ - get all members
exports.findAll = async (req, res, next) => {
    logger.debug(`${new Date().toUTCString()}, METHOD: ${req.method}, path:${req.originalUrl}`)
    try{
        const memberList = await memberService.findAll();
        res.json(memberList);
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Database error'));
    }
}


//READ - get one member by Id
exports.findById = async (req, res, next) => {
    const memberId = req.params.id;
    logger.debug(`${new Date().toUTCString()}, METHOD: ${req.method}, path:${req.originalUrl}` +
        ` Get one member with id: ${memberId}`);

    try{
        let member = await memberService.findById(memberId);
        if(!member) return next(new createError.NotFound(`Member with ${memberId} is not found`))
        res.json(member);
    }catch(err){
        logger.error(err);
        if(err.kind === "ObjectId") return next(new createError.BadRequest(`Invalid ObjectId: ${memberId}`));
        return next(new createError.InternalServerError('Database error'));
    }
}


//UPDATE
exports.update = async (req, res, next) => {
    logger.info(
        `A new ${req.method}, request has been sent at ${new Date().toUTCString()}, path: ${req.url}`
      );
    const memberId = req.params.id;

    const memberToUpdate = {
        name: req.body['name'],
        phoneNumber: req.body['phoneNumber'],
        address: req.body['address'],
        email: req.body['email'],
        password: req.body['password']
    };

    try {
      const updatedMember =  await memberService.update(memberId, memberToUpdate);
      if(!updatedMember) return next(new createError.NotFound(`Member with ${memberId} is not found`))
      res.json(updatedMember);

    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError(`Could not update member with id ${memberId}`));
    }
}


//DELETE a member by Id
exports.delete = async(req, res, next) => {
    const memberId = req.params.id;
    try{
        const deletedMember = await memberService.delete(memberId);
        if(!deletedMember) return next(new createError.NotFound(`Member with ${memberId} is not found`))
        res.json({_id: deletedMember._id})
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Database error'));
    }
}
