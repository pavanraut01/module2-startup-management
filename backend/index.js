const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/modules/auth/authRoutes'));
app.use('/api/startups', require('./src/modules/startups/startupRoutes'));
app.use('/api/churn', require('./src/modules/churn/churnRoutes'));
app.use('/api/revenue', require('./src/modules/revenue/revenueRoutes'));
app.use('/api/analytics', require('./src/modules/analytics/analyticsRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Startup Management System API' });
});

// Health check endpoint for AI Agents
app.get('/api/health', (req, res) => {
    res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
