-- Create database module2
CREATE DATABASE IF NOT EXISTS module2;

USE module2;

-- 1. Tenants
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 4. Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

-- 5. Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL
);

-- 6. Startups
CREATE TABLE IF NOT EXISTS startups (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sector VARCHAR(100),
    stage VARCHAR(50),
    geography VARCHAR(100),
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

-- 7. Customers
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    startup_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    status ENUM('active', 'churned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups (id) ON DELETE CASCADE
);

-- 8. Churn Events
CREATE TABLE IF NOT EXISTS churn_events (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36),
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    churn_type ENUM('voluntary', 'involuntary'),
    reason TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

-- 9. Revenue Metrics
CREATE TABLE IF NOT EXISTS revenue_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    startup_id VARCHAR(36),
    metric_date DATE,
    mrr DECIMAL(15, 2),
    arr DECIMAL(15, 2),
    burn_rate DECIMAL(15, 2),
    runway_months INT,
    FOREIGN KEY (startup_id) REFERENCES startups (id) ON DELETE CASCADE,
    UNIQUE KEY idx_startup_date (startup_id, metric_date)
);

-- Seed Initial Data
INSERT INTO
    roles (name, description)
VALUES (
        'super_admin',
        'Full system access'
    ),
    (
        'retention_manager',
        'Manage churn and retention'
    ),
    (
        'customer_success_manager',
        'Manage customer relationships'
    );

INSERT INTO
    tenants (id, name, domain)
VALUES (
        'tenant-1',
        'Default Tenant',
        'default.com'
    );

-- Password is 'admin123' (hashed)
INSERT INTO
    users (
        id,
        tenant_id,
        full_name,
        email,
        password_hash,
        role_id
    )
VALUES (
        'admin-1',
        'tenant-1',
        'System Admin',
        'admin@module2.com',
        '$2b$10$7R9fJ.A6K.o0o/uVp9v6.e1qQ8z7f7f7f7f7f7f7f7f7f7f7f7f',
        (
            SELECT id
            FROM roles
            WHERE
                name = 'super_admin'
        )
    );

INSERT INTO
    startups (
        id,
        tenant_id,
        name,
        slug,
        sector,
        stage,
        geography,
        description
    )
VALUES (
        'startup-1',
        'tenant-1',
        'TechFlow AI',
        'techflow-ai',
        'AI/ML',
        'Seed',
        'San Francisco',
        'Next-gen workflow automation'
    );

INSERT INTO
    customers (
        id,
        startup_id,
        name,
        email,
        status
    )
VALUES (
        'cust-1',
        'startup-1',
        'Acme Innovations',
        'contact@acme.com',
        'active'
    ),
    (
        'cust-2',
        'startup-1',
        'Horizon Global',
        'info@horizon.com',
        'active'
    ),
    (
        'cust-3',
        'startup-1',
        'Vertex Systems',
        'support@vertex.com',
        'active'
    );