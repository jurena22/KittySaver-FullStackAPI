const express = require('express');
const router = express.Router();
const messageController = require('./message.controller')


const authenticateJWT = require('../../auth/authenticate');
const adminAuth = require('../../auth/adminOnly');


router.post('/', authenticateJWT, (req, res, next)=> {
    return messageController.create(req, res, next);
})

router.get('/', authenticateJWT, adminAuth, (req, res, next)=> {
    return messageController.findAll(req, res, next);
})

router.get('/:id', authenticateJWT, adminAuth, (req, res, next)=> {
    return messageController.findById(req, res, next);
})

router.put('/:id', authenticateJWT, adminAuth, (req, res, next)=> {
    return messageController.update(req, res, next)
})


module.exports = router;