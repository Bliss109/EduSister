const express = require('express');
const router = express.Router();

// Modularized Controllers
const userController = require('../controllers/userController');
const contentController = require('../controllers/contentController');
const assignmentController = require('../controllers/assignmentController');
const notificationController = require('../controllers/notificationController');
const statsController = require('../controllers/statsController');
const communityController = require('../controllers/communityController');

// 📂 User Management
router.get('/users', userController.getUsersByRole);
router.patch('/users/:id', userController.updateUser);
router.patch('/users/:id/roles', userController.promoteUser);
router.patch('/users/:id/roles/remove', userController.demoteUser);
router.post('/users/:id/flag', userController.flagUser);

// 📂 Motivational Content
router.post('/content', contentController.addMotivationalContent);
router.get('/content', contentController.getAllMotivationalContent);
router.patch('/content/:id', contentController.updateMotivationalContent);
router.delete('/content/:id', contentController.deleteMotivationalContent);

// 📂 Mentor Assignments
router.post('/assign', assignmentController.assignMentor);
router.get('/assignments', assignmentController.getAllAssignments);

// 📂 Assignment Stats (corrected from earlier)
router.get('/assignments/stats', statsController.getAssignmentStats);

// 📂 Notifications
router.post('/notify', notificationController.sendNotification);

// 📂 Admin Stats
router.get('/stats', statsController.getAdminStats);

// 📂 Community Features
router.post('/community/posts', communityController.createCommunityPost);
router.post('/community/posts/:postId/comments', communityController.addCommentToCommunityPost);

module.exports = router;