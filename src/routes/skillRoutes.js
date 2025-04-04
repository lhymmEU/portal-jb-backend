const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { skillValidation, skillUpdateValidation } = require('../middleware/validation');
const { auth, authorize, hasPermission } = require('../middleware/auth');

// Public routes
router.get('/all', skillController.getAllSkills);
router.get('/:id', skillController.getSkill);

// Protected routes (admin only)
router.post('/create', auth, hasPermission('admin:skills'), skillValidation, skillController.createSkill);
router.put('/:id', auth, hasPermission('admin:skills'), skillUpdateValidation, skillController.updateSkill);
router.delete('/:id', auth, hasPermission('admin:skills'), skillController.deleteSkill);

module.exports = router; 