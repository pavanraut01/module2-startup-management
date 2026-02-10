import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, Users, X, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const ChurnAnalytics = () => {
    const [startups, setStartups] = useState([]);
    const [selectedStartupId, setSelectedStartupId] = useState('');
    const [cohortData, setCohortData] = useState([]);
    const [metrics, setMetrics] = useState({
        total_customers: 0,
        active_customers: 0,
        churned_customers: 0,
        retention_rate: 0
    });
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        customer_id: '',
        churn_type: 'voluntary',
        reason: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await api.get('/startups');
                setStartups(res.data);
                if (res.data.length > 0) {
                    setSelectedStartupId(res.data[0].id);
                }
            } catch (err) {
                console.error('Error fetching startups:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStartups();
    }, []);

    useEffect(() => {
        if (selectedStartupId) {
            fetchAnalytics(selectedStartupId);
        }
    }, [selectedStartupId]);

    const fetchAnalytics = async (id) => {
        try {
            const [metricsRes, cohortRes, customersRes] = await Promise.all([
                api.get(`/churn/retention/${id}`),
                api.get(`/churn/cohort/${id}`),
                api.get(`/churn/customers/${id}`)
            ]);
            setMetrics(metricsRes.data);
            setCohortData(cohortRes.data);
            setCustomers(customersRes.data);

            // Auto-select first customer if available
            if (customersRes.data.length > 0) {
                setFormData(prev => ({ ...prev, customer_id: customersRes.data[0].id }));
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    };

    const handleLogChurn = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/churn/log-event', formData);
            setSuccessMsg('Churn event logged successfully!');
            setTimeout(() => {
                setShowModal(false);
                setSuccessMsg('');
                setFormData({ customer_id: '', churn_type: 'voluntary', reason: '' });
                fetchAnalytics(selectedStartupId);
            }, 2000);
        } catch (err) {
            alert('Failed to log churn event');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Initializing Engine...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Churn & Retention Engine</h1>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Analyzing Startup:</span>
                        <select
                            value={selectedStartupId}
                            onChange={(e) => setSelectedStartupId(e.target.value)}
                            style={{ padding: '8px 12px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--primary)', fontWeight: 'bold' }}
                        >
                            <option value="">-- Choose Startup --</option>
                            {startups.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={!selectedStartupId}>
                    + Log Churn Event
                </button>
            </div>

            {!selectedStartupId ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <AlertTriangle size={48} color="var(--accent-orange)" style={{ marginBottom: '1rem' }} />
                    <h2>No Startup Selected</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Please select a startup from the dropdown above to view retention analytics.</p>
                </div>
            ) : (
                <>
                    <div className="dashboard-grid">
                        <RiskCard title="Churned Customers" count={metrics.churned_customers} level="high" />
                        <RiskCard title="Active Customers" count={metrics.active_customers} level="med" />
                        <RiskCard title="Retention Rate" count={`${parseFloat(metrics.retention_rate || 0).toFixed(1)}%`} level="low" />
                    </div>

                    <div style={{ marginTop: '2.5rem' }}>
                        <h3>Cohort Retention Analysis</h3>
                        <div className="glass-card" style={{ marginTop: '1rem', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem' }}>Cohort Month</th>
                                        <th style={{ padding: '1rem' }}>Total Size</th>
                                        <th style={{ padding: '1rem' }}>Still Active</th>
                                        <th style={{ padding: '1rem' }}>Retention Rate</th>
                                        <th style={{ padding: '1rem' }}>Health Indicator</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cohortData.length > 0 ? cohortData.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem' }}>{row.cohort_month}</td>
                                            <td style={{ padding: '1rem' }}>{row.size}</td>
                                            <td style={{ padding: '1rem' }}>{row.retained}</td>
                                            <td style={{ padding: '1rem', color: 'var(--accent-green)' }}>
                                                {((row.retained / row.size) * 100).toFixed(1)}%
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', width: '100px' }}>
                                                    <div style={{ height: '100%', background: 'var(--accent-green)', borderRadius: '4px', width: `${(row.retained / row.size) * 100}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No data available for this startup.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '500px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Log Churn Event</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Logging for: <strong>{startups.find(s => s.id === selectedStartupId)?.name}</strong>
                        </p>

                        {successMsg ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                                <p style={{ fontSize: '1.1rem' }}>{successMsg}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleLogChurn}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Customer</label>
                                    <select
                                        required
                                        value={formData.customer_id}
                                        onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    >
                                        <option value="">-- Select Customer --</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {customers.length === 0 && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', marginTop: '0.5rem' }}>
                                            ⚠️ No active customers found for this startup.
                                        </p>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Churn Type</label>
                                    <select
                                        value={formData.churn_type}
                                        onChange={(e) => setFormData({ ...formData, churn_type: e.target.value })}
                                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    >
                                        <option value="voluntary">Voluntary (Cancelled)</option>
                                        <option value="involuntary">Involuntary (Payment Failed / Policy)</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Reason</label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        rows="3"
                                        style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        placeholder="Brief reason for churn..."
                                    />
                                </div>

                                <button type="submit" disabled={submitting || customers.length === 0} className="btn btn-primary" style={{ width: '100%' }}>
                                    {submitting ? 'Logging...' : 'Confirm Churn'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const RiskCard = ({ title, count, level }) => {
    const colors = {
        high: 'var(--accent-red)',
        med: 'var(--accent-orange)',
        low: 'var(--accent-green)'
    };

    return (
        <div className="glass-card" style={{ borderLeft: `4px solid ${colors[level]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {level === 'high' ? <AlertTriangle size={18} /> : (level === 'med' ? <Users size={18} /> : <TrendingUp size={18} />)}
                <span>{title}</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{count}</div>
        </div>
    );
};

export default ChurnAnalytics;
