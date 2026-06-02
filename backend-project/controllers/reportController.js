const Report = require('../models/reportModel');

exports.getDailyReport = async (req, res) => {
    try {
        const data = await Report.generateSummary('DAILY');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getWeeklyReport = async (req, res) => {
    try {
        const data = await Report.generateSummary('WEEKLY');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const data = await Report.generateSummary('MONTHLY');
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};