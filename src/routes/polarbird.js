const express = require('express');
const router = express.Router();
const polarbirdController = require('../controllers/polarbirdController');

router.get('/report', polarbirdController.message);

module.exports = router;