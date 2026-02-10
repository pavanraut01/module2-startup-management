import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, ShieldAlert, LogOut, BarChart3, User } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || 'User';
    const userName = localStorage.getItem('userName') || 'System Guest';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <h2 style={{ marginBottom: '2rem', padding: '0 1rem', color: 'var(--primary)' }}>SMS OS</h2>
            <nav style={{ height: 'calc(100% - 100px)', display: 'flex', flexDirection: 'column' }}>
                <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <SidebarItem to="/startups" icon={<Users size={20} />} label="Startups" />
                <SidebarItem to="/churn" icon={<ShieldAlert size={20} />} label="Churn Engine" />
                <SidebarItem to="/revenue" icon={<TrendingUp size={20} />} label="Revenue" />
                <SidebarItem to="/analytics" icon={<BarChart3 size={20} />} label="AI Insights" />

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} color="white" />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{role}</div>
                        </div>
                    </div>

                    <button className="btn" onClick={handleLogout} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>
        </div>
    );
};

const SidebarItem = ({ to, icon, label }) => (
    <Link to={to} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0.75rem 1rem',
        color: 'var(--text-main)',
        textDecoration: 'none',
        borderRadius: '8px',
        marginBottom: '0.5rem',
        transition: 'background 0.2s'
    }} className="sidebar-link">
        {icon} <span>{label}</span>
    </Link>
);

export default Sidebar;
