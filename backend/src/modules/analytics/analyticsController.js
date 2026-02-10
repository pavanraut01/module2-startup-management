const db = require('../../config/db');

exports.getAIData = async (req, res) => {
    const { startup_id } = req.params;
    try {
        // Structured data for AI agents including revenue, churn, and lifecycle metrics
        const [revenue] = await db.execute('SELECT mrr, arr, burn_rate, runway_months, metric_date FROM revenue_metrics WHERE startup_id = ? ORDER BY metric_date DESC LIMIT 1', [startup_id]);
        const [churn] = await db.execute('SELECT COUNT(*) as churn_count FROM churn_events ce JOIN customers c ON ce.customer_id = c.id WHERE c.startup_id = ?', [startup_id]);
        const [customers] = await db.execute('SELECT status, COUNT(*) as count FROM customers WHERE startup_id = ? GROUP BY status', [startup_id]);
        const [startup] = await db.execute('SELECT name, sector, stage FROM startups WHERE id = ?', [startup_id]);

        const aiResponse = {
            metadata: {
                startup_name: startup[0]?.name,
                sector: startup[0]?.sector,
                stage: startup[0]?.stage,
                generated_at: new Date().toISOString()
            },
            financial_snapshot: revenue[0] || null,
            retention_data: {
                churn_event_count: churn[0]?.churn_count,
                customer_segments: customers
            }
        };

        res.json(aiResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHistoricalSeries = async (req, res) => {
    const { startup_id } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT metric_date, mrr, arr FROM revenue_metrics WHERE startup_id = ? ORDER BY metric_date ASC',
            [startup_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
