const createError = require('http-errors');
const catService = require('./cat.service');
const logger = require('../../config/logger');
const Cat = require('../../models/cat.model');

//CREATE - save a new cat
exports.create = async (req, res, next) => {
    
    const validationErrors = new Cat(req.body).validateSync();
    if(validationErrors) {
        return next(new createError.BadRequest(validationErrors));
    }

    const newCat = {
        name : req.body['name'],
        sex: req.body['sex'],
        color: req.body['color'],
        description: req.body['description'],
        imgUrl: req.body['imgUrl'],
        adoptable: req.body['adoptable']
    };

    try {
        const savedCat = await catService.create(newCat);
        logger.info(`New cat saved`);
        res.status(201).json(savedCat);
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Database error: cat could not be saved'));
    }
}


//READ - get all cats
exports.findAll = async (req, res, next) => {
    logger.debug(`${new Date().toUTCString()}, METHOD: ${req.method}, path:${req.originalUrl}`)
    try{
        const catList = await catService.findAll();
        res.json(catList);
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Database error'));
    }
}


//READ - get one cat by ID
exports.findById = async (req, res, next) => {
    const catId = req.params.id;
    logger.debug(`${new Date().toUTCString()}, METHOD: ${req.method}, path:${req.originalUrl}` +
        ` Get one cat with id: ${catId}`);

    try{
        let cat = await catService.findById(catId);
        if(!cat) return next(new createError.NotFound(`Cat with ${catId} is not found`))
        res.json(cat);
    }catch(err){
        logger.error(err);
        if(err.kind === "ObjectId") return next(new createError.BadRequest(`Invalid ObjectId: ${catId}`));
        return next(new createError.InternalServerError('Database error'));
    }
}


//UPDATE - update some data of a cat
exports.update = async (req, res, next) => {
    logger.info(
        `A new ${req.method}, request has been sent at ${new Date().toUTCString()}, path: ${req.url}`
      );
    const catId = req.params.id;

    const catToUpdate = {
        name : req.body['name'],
        sex: req.body['sex'],
        color: req.body['color'],
        description: req.body['description'],
        imgUrl: req.body['imgUrl'],
        adoptable: req.body['adoptable']
    };

    try {
      const updatedCat =  await catService.update(catId, catToUpdate);
      if(!updatedCat) return next(new createError.NotFound(`Cat with ${catId} is not found`));
      res.json(updatedCat);

    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError(`Could not update cat with id ${catId}`));
    }
}


//DELETE - remove a cat
exports.delete = async(req, res, next) => {
    const catId = req.params.id;
    try{
        const deletedCat = await catService.delete(catId);
        if(!deletedCat) return next(new createError.NotFound(`Cat with ${catId} is not found`))
        res.json({_id: deletedCat._id})
    }catch(err){
        logger.error(err);
        return next(new createError.InternalServerError('Database error'));
    }
}
