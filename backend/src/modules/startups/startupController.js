const db = require('../../config/db');

const { v4: uuidv4 } = require('uuid');

exports.getAllStartups = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM startups');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStartupById = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM startups WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Startup not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStartup = async (req, res) => {
    const { name, sector, stage, geography, description, website } = req.body;
    if (!name || !sector || !geography) {
        return res.status(400).json({ error: 'Name, Sector, and Geography are required' });
    }

    const id = uuidv4();
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    try {
        const [result] = await db.execute(
            'INSERT INTO startups (id, name, slug, sector, stage, geography, description, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, slug, sector, stage || 'idea', geography, description || '', website || '']
        );
        res.status(201).json({ message: 'Startup created successfully', startupId: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStartup = async (req, res) => {
    const { name, sector, stage, geography, description, website } = req.body;
    try {
        await db.execute(
            'UPDATE startups SET name = ?, sector = ?, stage = ?, geography = ?, description = ?, website = ? WHERE id = ?',
            [name, sector, stage, geography, description, website, req.params.id]
        );
        res.json({ message: 'Startup updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteStartup = async (req, res) => {
    try {
        await db.execute('DELETE FROM startups WHERE id = ?', [req.params.id]);
        res.json({ message: 'Startup deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
