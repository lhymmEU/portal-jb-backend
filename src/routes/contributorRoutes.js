const express = require('express');
const router = express.Router();
const contributorController = require('../controllers/contributorController');
const { contributorValidation } = require('../middleware/validation');
const { auth, authorize, hasPermission } = require('../middleware/auth');

// Public routes (no auth required)
router.post('/register', contributorValidation, contributorController.register);
router.post('/login', contributorController.login);

// Protected routes (auth required)
router.get('/profile', auth, hasPermission('read:profile'), contributorController.getProfile);
router.put('/profile', auth, hasPermission('update:profile'), contributorValidation, contributorController.updateProfile);
router.delete('/profile', auth, hasPermission('delete:profile'), contributorController.deleteProfile);

// Admin routes
router.get('/', auth, hasPermission('admin:users'), contributorController.getAll);

module.exports = router; 