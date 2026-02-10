-- Seed data for SMS
USE startups;

-- Roles
INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Platform Admin', 'Manage tenants and platform settings'),
('Security Auditor', 'View logs and compliance metrics'),
('Startup Founder', 'Manage own startup and team'),
('Co-Founder', 'Full access to startup operations'),
('Team Member', 'Basic access to startup modules'),
('Advisor / Mentor', 'View-only access to specific startup metrics'),
('Revenue Manager', 'Manage subscriptions and billing'),
('Customer Success Manager', 'Track customer health and retention'),
('Retention Manager', 'Focus on churn prevention and renewals'),
('Operations Manager', 'General startup operations'),
('Finance Manager', 'Manage revenue and financial metrics'),
('Compliance Officer', 'Risk and regulatory oversight'),
('Growth Manager', 'Manage marketing and SEO'),
('Marketing Analyst', 'Analyze growth metrics'),
('AI Agent', 'System role, read-only data access'),
('Data Scientist', 'Access to historical data for modeling'),
('Analytics Engineer', 'Build and maintain data pipelines');

-- Permissions (Sample)
INSERT INTO permissions (name, description) VALUES
('tenant:view', 'View tenant details'),
('tenant:manage', 'Edit/Create tenants'),
('user:manage', 'Create/Edit users'),
('startup:create', 'Create a new startup'),
('startup:view', 'View startup profiles'),
('revenue:view', 'View revenue metrics'),
('revenue:edit', 'Modify billing/subscriptions'),
('churn:view', 'View churn and retention data'),
('ai:read', 'Access specific AI-optimized datasets'),
('audit:view', 'View audit logs');

-- Role Permissions (Mapping for Super Admin)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Super Admin';

-- Sample Tenant
INSERT INTO tenants (name, domain) VALUES ('Global Tech Ventures', 'globaltech.com');

-- Sample Super Admin (Password: admin123)
-- Note: In a real app, use hashed password.
INSERT INTO users (tenant_id, full_name, email, password_hash, role_id)
VALUES (1, 'System Admin', 'admin@sms.com', '$2b$10$YourHashedPasswordHere', (SELECT id FROM roles WHERE name = 'Super Admin'));
