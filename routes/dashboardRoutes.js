const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', dashboardController.dashboard);

router.get('/index', dashboardController.index);

module.exports = router;
