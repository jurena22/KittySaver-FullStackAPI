const express = require('express');
const router = express.Router();
const catController = require('./cat.controller')

const authenticateJWT = require('../../auth/authenticate');
const adminAuth = require('../../auth/adminOnly');

router.post('/', authenticateJWT, adminAuth, (req, res, next)=> {
    return catController.create(req, res, next);
})

router.get('/', (req, res, next)=> {
    return catController.findAll(req, res, next);
})

router.get('/:id', (req, res, next)=> {
    return catController.findById(req, res, next);
})

router.put('/:id', authenticateJWT, (req, res, next)=> {
    return catController.update(req, res, next)
})

router.delete('/:id', authenticateJWT, adminAuth, (req, res, next)=> {
    return catController.delete(req, res, next)
})

module.exports = router;