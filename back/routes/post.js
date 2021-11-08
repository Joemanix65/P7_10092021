const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

router.post('/', auth, postCtrl.create);

router.get('/', auth, postCtrl.findAll);

router.get('/:id', auth, postCtrl.findById);

router.put('/:id', auth, postCtrl.updateById);

router.delete('/:id', auth, postCtrl.delete);


module.exports = router;