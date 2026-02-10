const express = require('express');
const router = express.Router();
const revenueController = require('./revenueController');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

router.get('/:startup_id', authenticate, revenueController.getRevenueMetrics);
router.post('/', authenticate, authorize(['super_admin', 'finance_manager', 'operations_manager']), revenueController.updateRevenueMetrics);

module.exports = router;
