const express = require('express');
const router = express.Router();
const memberController = require('./member.controller');


const authenticateJWT = require('../../auth/authenticate');
const adminAuth = require('../../auth/adminOnly');
const ownAuth = require('../../auth/ownOnly');


router.post('/', (req, res, next)=> {
    return memberController.create(req, res, next);
})

router.get('/', authenticateJWT, adminAuth, (req, res, next)=> {
    return memberController.findAll(req, res, next);
})

router.get('/:id', authenticateJWT, ownAuth, (req, res, next)=> {
    return memberController.findById(req, res, next);
})

router.put('/:id', authenticateJWT, ownAuth, (req, res, next)=> {
    return memberController.update(req, res, next)
})

router.delete('/:id', authenticateJWT, adminAuth, (req, res, next)=> {
    return memberController.delete(req, res, next)
})

module.exports = router;