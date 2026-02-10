import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, AlertCircle, DollarSign } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import api from '../utils/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        mrr: 125000,
        activeCustomers: 450,
        churnRate: 2.4,
        runway: 18
    });

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'MRR Growth',
                data: [80000, 95000, 105000, 115000, 120000, 125000],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
                fill: true
            },
        ],
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Startup Overview</h1>

            <div className="dashboard-grid">
                <StatCard title="Monthly Recurring Revenue" value={`$${stats.mrr.toLocaleString()}`} icon={<DollarSign color="#6366f1" />} trend="+12%" />
                <StatCard title="Active Customers" value={stats.activeCustomers} icon={<Users color="#10b981" />} trend="+5%" />
                <StatCard title="Net Churn Rate" value={`${stats.churnRate}%`} icon={<AlertCircle color="#ef4444" />} trend="-0.2%" />
                <StatCard title="Cash Runway" value={`${stats.runway} Months`} icon={<TrendingUp color="#f59e0b" />} trend="Stable" />
            </div>

            <div className="glass-card" style={{ marginTop: '2rem', height: '400px' }}>
                <h3>MRR Over Time</h3>
                <div style={{ height: '320px', marginTop: '1rem' }}>
                    <Line data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend }) => (
    <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{title}</span>
            {icon}
        </div>
        <div className="metric-value">{value}</div>
        <div style={{ fontSize: '0.85rem', color: trend.startsWith('+') ? '#10b981' : (trend.startsWith('-') ? '#ef4444' : 'var(--text-muted)') }}>
            {trend} <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
        </div>
    </div>
);

export default Dashboard;
