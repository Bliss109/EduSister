const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

// POST new mood
router.post('/', moodController.saveMood);

// GET all moods for user
router.get('/:uid', moodController.getMoodEntries);

module.exports = router;