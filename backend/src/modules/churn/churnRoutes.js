const express = require('express');
const router = express.Router();
const churnController = require('./churnController');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

router.post('/log-event', authenticate, authorize(['super_admin', 'retention_manager', 'customer_success_manager']), churnController.logChurnEvent);
router.get('/customers/:startup_id', authenticate, churnController.getCustomers);
router.get('/retention/:startup_id', authenticate, churnController.getRetentionMetrics);
router.get('/cohort/:startup_id', authenticate, churnController.getCohortAnalysis);

module.exports = router;
