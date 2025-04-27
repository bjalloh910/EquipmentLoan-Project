const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');

router.get('/', userController.showUsers);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.post('/create', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;