const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();

// @route   GET /api/reports/daily
// @desc    Get dynamic single-day hiring metrics and month-to-date payroll totals
router.get('/daily', reportController.getDailyReport);

// @route   GET /api/reports/weekly
// @desc    Get rolling 7-day personnel deployment trends and financial operational data
router.get('/weekly', reportController.getWeeklyReport);

// @route   GET /api/reports/monthly
// @desc    Get comprehensive 30-day employee onboarding metrics and total monthly ledger balances
router.get('/monthly', reportController.getMonthlyReport);

module.exports = router;