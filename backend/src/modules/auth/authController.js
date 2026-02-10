const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${first_name} ${last_name}`;

        // Create User - Default role_id = 1 (super_admin)
        await db.execute(
            'INSERT INTO users (id, full_name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)',
            [userId, fullName, email, hashedPassword, 1]
        );

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute(
            'SELECT u.*, r.name as role_name FROM users u ' +
            'LEFT JOIN roles r ON u.role_id = r.id ' +
            'WHERE u.email = ?',
            [email]
        );
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.full_name,
                role: user.role_name
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
