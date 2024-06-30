const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
//const userAuth = require('../controllers/UserAuth')
//admin
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
//router.post('/', userController.createUser);
//router.put('/:id', userController.updateUser);
//router.delete('/:id', userController.deleteUser);

//Build a good validate
//router.get('/login/:id', userAuth.getCredentialId);
//router.post('/login', userAuth.getCookieByCredential);


module.exports = router;