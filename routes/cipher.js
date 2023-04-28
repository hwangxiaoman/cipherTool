const express = require('express');
const router = express.Router();
const cipherController = require('../controllers/cipherController');

router.get('/cipher', cipherController.geCipher);

module.exports = router;
