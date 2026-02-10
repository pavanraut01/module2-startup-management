const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

exports.logChurnEvent = async (req, res) => {
    const { customer_id, churn_type, reason } = req.body;
    if (!customer_id || !churn_type) {
        return res.status(400).json({ error: 'Customer ID and Churn Type are required' });
    }

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const eventId = uuidv4();
            // Insert churn event
            await connection.execute(
                'INSERT INTO churn_events (id, customer_id, churn_type, reason) VALUES (?, ?, ?, ?)',
                [eventId, customer_id, churn_type, reason]
            );

            // Update customer status to 'churned'
            await connection.execute(
                'UPDATE customers SET status = "churned" WHERE id = ?',
                [customer_id]
            );

            await connection.commit();
            res.status(201).json({ message: 'Churn event logged successfully', eventId });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    const { startup_id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM customers WHERE startup_id = ? AND status = "active"', [startup_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getRetentionMetrics = async (req, res) => {
    const { startup_id } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total_customers,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_customers,
                SUM(CASE WHEN status = 'churned' THEN 1 ELSE 0 END) as churned_customers,
                IFNULL((SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 0) as retention_rate
            FROM customers
            WHERE startup_id = ?
        `, [startup_id]);

        res.json(rows[0] || { total_customers: 0, active_customers: 0, churned_customers: 0, retention_rate: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCohortAnalysis = async (req, res) => {
    const { startup_id } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as cohort_month,
                COUNT(*) as size,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as retained
            FROM customers
            WHERE startup_id = ?
            GROUP BY cohort_month
            ORDER BY cohort_month DESC
        `, [startup_id]);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
