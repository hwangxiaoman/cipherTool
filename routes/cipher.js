const express = require('express');
const router = express.Router();
const cipherController = require('../controllers/cipherController');

router.get('/cipher', cipherController.getCipher);
router.post('/cipher', cipherController.doCipher);

module.exports = router;
