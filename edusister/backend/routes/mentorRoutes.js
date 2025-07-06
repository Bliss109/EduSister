const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

// GET /api/mentor/:mentorId/stats
router.get('/:mentorId/stats', mentorController.getMentorStats);

// GET /api/mentor/:mentorId/profile
router.get('/:mentorId/profile', mentorController.getMentorProfile);


module.exports = router;
