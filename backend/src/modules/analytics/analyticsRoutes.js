const express = require('express');
const router = express.Router();
const analyticsController = require('./analyticsController');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');

// AI agents can only access AI data
router.get('/ai-snapshot/:startup_id', authenticate, authorize(['super_admin', 'ai_agent', 'data_scientist']), analyticsController.getAIData);
router.get('/historical/:startup_id', authenticate, analyticsController.getHistoricalSeries);

module.exports = router;
