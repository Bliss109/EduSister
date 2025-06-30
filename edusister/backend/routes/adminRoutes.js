const express = require('express');
const router = express.Router();

const {
    getUsersByRole
} = require('../controllers/adminController');

router.get('/users', getUsersByRole);

module.exports = router;