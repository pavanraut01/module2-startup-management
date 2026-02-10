const db = require('../../config/db');

exports.getRevenueMetrics = async (req, res) => {
    const { startup_id } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM revenue_metrics WHERE startup_id = ? ORDER BY metric_date DESC LIMIT 12',
            [startup_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateRevenueMetrics = async (req, res) => {
    const { startup_id, metric_date, mrr, arr, burn_rate, runway_months } = req.body;
    try {
        await db.execute(
            'INSERT INTO revenue_metrics (startup_id, metric_date, mrr, arr, burn_rate, runway_months) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE mrr=VALUES(mrr), arr=VALUES(arr), burn_rate=VALUES(burn_rate), runway_months=VALUES(runway_months)',
            [startup_id, metric_date, mrr, arr, burn_rate, runway_months]
        );
        res.status(201).json({ message: 'Revenue metrics updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
