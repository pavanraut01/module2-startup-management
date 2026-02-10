import React from 'react';
import { BrainCircuit, FileJson, Zap } from 'lucide-react';

const AIInsights = () => {
    const aiData = {
        metadata: {
            startup_name: "FinTech Pro",
            sector: "FinTech",
            stage: "Series A",
            generated_at: "2026-02-07T15:30:00Z"
        },
        financial_snapshot: {
            mrr: 125000,
            arr: 1500000,
            burn_rate: 45000,
            runway_months: 18
        },
        insight: "Customer health score has improved by 12% in the 'Enterprise' segment. Recommended action: Target expansion for 5 high-score accounts."
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>AI Data Services</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Read-only structured data endpoints for AI Agents</p>

            <div className="dashboard-grid">
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <BrainCircuit color="var(--primary)" />
                        <h3>AI Agent Context (JSON)</h3>
                    </div>
                    <pre style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '8px', color: '#10b981', overflowX: 'auto' }}>
                        {JSON.stringify(aiData, null, 4)}
                    </pre>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Zap color="#f59e0b" />
                        <h3>Feature Ready Streams</h3>
                    </div>
                    <ul style={{ listStyle: 'none', color: 'var(--text-muted)' }}>
                        <li style={{ marginBottom: '1rem' }}><FileJson size={14} /> GET /api/analytics/ai-snapshot</li>
                        <li style={{ marginBottom: '1rem' }}><FileJson size={14} /> GET /api/analytics/historical</li>
                        <li style={{ marginBottom: '1rem' }}><FileJson size={14} /> GET /api/churn/retention</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;
