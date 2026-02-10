import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const successMessage = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userId', user.id);

            // Reload window to update App's auth state or just navigate
            // Here navigate is usually enough if App uses localStorage on render
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
            <div className="glass-card" style={{ width: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>SMS Login</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Enterprise Startup Management OS</p>

                {successMessage && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px 10px 10px 40px', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Authenticating...' : 'Sign In to Workspace'}
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            New user? <button type="button" onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Create Account</button>
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            New startup? <button type="button" onClick={() => navigate('/register-startup')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Register Here</button>
                        </p>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <p>Roles enforced via JWT & RBAC</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
