import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const SignUp = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)', padding: '1rem' }}>
            <div className="glass-card" style={{ width: '450px' }}>
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>Create Account</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Join the SMS Platform</p>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>First Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="first_name"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                                    placeholder="John"
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Last Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="last_name"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                                placeholder="john@company.com"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '10px 10px 10px 36px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? 'Processing...' : <><UserPlus size={18} /> Create Account</>}
                    </button>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Login Here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
