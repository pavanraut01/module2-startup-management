import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Building, Globe, Mail, Briefcase, Info, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const PublicCreateStartup = () => {
    const [formData, setFormData] = useState({
        name: '',
        sector: '',
        stage: 'idea',
        geography: '',
        website: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/startups', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register startup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
                <div className="glass-card" style={{ width: '500px', textAlign: 'center', padding: '3rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Rocket size={40} color="#10b981" />
                    </div>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Success!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        Your startup <strong>{formData.name}</strong> has been registered successfully.
                    </p>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <div className="glass-card">
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Register Your Startup</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Join the Enterprise Startup Management ecosystem</p>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Startup Name*</label>
                                <div style={{ position: 'relative' }}>
                                    <Building size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        placeholder="Acme Corp"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Sector*</label>
                                <div style={{ position: 'relative' }}>
                                    <Briefcase size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        name="sector"
                                        required
                                        value={formData.sector}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        placeholder="SaaS, FinTech, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Growth Stage</label>
                                <select
                                    name="stage"
                                    value={formData.stage}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                >
                                    <option value="idea">Idea Stage</option>
                                    <option value="mvp">MVP</option>
                                    <option value="seed">Seed</option>
                                    <option value="early">Early Stage</option>
                                    <option value="growth">Growth</option>
                                    <option value="scale">Scale</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Geography*</label>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        name="geography"
                                        required
                                        value={formData.geography}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                        placeholder="USA, Europe, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Website URL</label>
                            <div style={{ position: 'relative' }}>
                                <Globe size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                            <div style={{ position: 'relative' }}>
                                <Info size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', resize: 'vertical' }}
                                    placeholder="Tell us about your startup..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: '600' }}
                        >
                            {loading ? 'Processing...' : 'Register Startup'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PublicCreateStartup;
