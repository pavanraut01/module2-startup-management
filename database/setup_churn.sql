USE startups;

-- Create Customers table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    startup_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    status ENUM('active', 'churned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

-- Create Churn Events table
CREATE TABLE IF NOT EXISTS churn_events (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36),
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    churn_type ENUM('voluntary', 'involuntary'),
    reason TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Seed some sample customers for the first startup
-- First, get a startup ID
SET @startupId = (SELECT id FROM startups LIMIT 1);

INSERT INTO customers (id, startup_id, name, email, status) VALUES
(UUID(), @startupId, 'Acme Corp', 'contact@acme.com', 'active'),
(UUID(), @startupId, 'Global Tech', 'info@globaltech.com', 'active'),
(UUID(), @startupId, 'Nexus Solutions', 'nexus@solutions.com', 'active'),
(UUID(), @startupId, 'Quantum Soft', 'hello@quantum.com', 'active');
