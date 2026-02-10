const http = require('http');

async function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsedBody = body ? JSON.parse(body) : null;
                    resolve({ statusCode: res.statusCode, data: parsedBody });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verifyCustomers() {
    const testEmail = `test_customer_${Date.now()}@example.com`;
    const testPassword = 'password123';

    try {
        // 1. Register
        await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            first_name: 'Test',
            last_name: 'User',
            email: testEmail,
            password: testPassword
        });

        // 2. Login
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: testEmail,
            password: testPassword
        });

        const token = loginRes.data.token;
        console.log('Token obtained.');

        // 3. Get Startups
        const startupsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/startups',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Startups found:', startupsRes.data.length);
        if (startupsRes.data.length === 0) {
            console.log('No startups found.');
            process.exit(0);
        }

        const startupId = startupsRes.data[0].id;
        console.log('Using Startup ID:', startupId);

        // 4. Get Customers
        const customersRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/churn/customers/${startupId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Customers found:', customersRes.data.length);
        console.log('Customers sample:', JSON.stringify(customersRes.data.slice(0, 2), null, 2));

        if (customersRes.data.length > 0) {
            console.log('✅ Customers are being returned by the API.');
        } else {
            console.log('❌ No active customers returned.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

verifyCustomers();
