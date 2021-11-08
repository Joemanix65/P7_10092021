const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config');

router.post('/signup', multer, userCtrl.signup);

router.post('/login', userCtrl.login);

router.get('/',  userCtrl.findAll);

router.get('/:id', userCtrl.findById);

router.put('/:id', multer, userCtrl.updateById);

router.delete('/:id', userCtrl.delete);


module.exports = router;