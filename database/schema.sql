-- Startup Management System (SMS) Schema
-- Database: startups

CREATE DATABASE IF NOT EXISTS startups;
USE startups;

-- 1. Tenants (Multi-tenant isolation)
CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles & Permissions (RBAC)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 3. Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- 4. Startups
CREATE TABLE IF NOT EXISTS startups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    stage VARCHAR(50),
    geography VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 5. Customers
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    startup_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    status ENUM('active', 'churned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

-- 6. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    plan_name VARCHAR(100),
    amount DECIMAL(10, 2),
    billing_interval ENUM('monthly', 'yearly'),
    status ENUM('active', 'canceled', 'past_due') DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 7. Revenue Metrics
CREATE TABLE IF NOT EXISTS revenue_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    startup_id INT,
    metric_date DATE,
    mrr DECIMAL(15, 2),
    arr DECIMAL(15, 2),
    burn_rate DECIMAL(15, 2),
    runway_months INT,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

-- 8. Churn Events
CREATE TABLE IF NOT EXISTS churn_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    churn_type ENUM('voluntary', 'involuntary'),
    reason TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 9. Health Scores
CREATE TABLE IF NOT EXISTS health_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    score INT CHECK (score BETWEEN 0 AND 100),
    risk_flags JSON,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    resource VARCHAR(100),
    resource_id INT,
    meta_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_startup_metrics ON revenue_metrics(startup_id, metric_date);
CREATE INDEX idx_customer_status ON customers(status);
CREATE INDEX idx_audit_timestamp ON audit_logs(created_at);
