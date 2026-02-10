const express = require('express');
const router = express.Router();
const startupController = require('./startupController');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

router.get('/', authenticate, startupController.getAllStartups);
router.get('/:id', authenticate, startupController.getStartupById);
router.post('/', startupController.createStartup);
router.put('/:id', authenticate, authorize(['super_admin', 'founder', 'cofounder']), startupController.updateStartup);
router.delete('/:id', authenticate, authorize(['super_admin']), startupController.deleteStartup);

module.exports = router;
