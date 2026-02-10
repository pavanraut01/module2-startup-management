const http = require('http');

async function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTest() {
    try {
        const email = `test.${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`1. Registering user ${email}...`);
        const registerRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            first_name: 'Test',
            last_name: 'User',
            email,
            password
        });

        if (registerRes.status !== 201) {
            console.log('Registration failed, trying login with admin...');
            // Fallback to admin if register fails (e.g. if I used a fixed email, but I used random so it should be fine)
            // Actually, let's just fail if register fails
            console.error('Registration failed:', registerRes.body);
            return;
        }

        // Login to get token
        console.log('2. Logging in...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email, password });

        if (loginRes.status !== 200) throw new Error('Login failed: ' + JSON.stringify(loginRes.body));
        const token = loginRes.body.token;
        const authHeader = { 'Authorization': `Bearer ${token}` };

        console.log('3. Fetching startups...');
        const startupsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/startups',
            method: 'GET',
            headers: authHeader
        });

        if (!startupsRes.body || startupsRes.body.length === 0) {
            console.log('No startups found. Creating one...');
            const createStartupRes = await request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/startups',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' } // It is public
            }, {
                name: 'Test Startup ' + Date.now(),
                industry: 'Tech',
                description: 'Auto created'
            });
            if (createStartupRes.status !== 201) throw new Error('Failed to create startup');

            // Re-fetch
            const startupsRes2 = await request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/startups',
                method: 'GET',
                headers: authHeader
            });
            startupsRes.body = startupsRes2.body;
        }

        const sId = startupsRes.body[0].id;
        console.log(`Using Startup ID: ${sId}`);

        console.log('4. Fetching customers...');
        const customersRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/churn/customers/${sId}`,
            method: 'GET',
            headers: authHeader
        });

        console.log('CUSTOMERS RESPONSE:', customersRes.status);
        console.log('CUSTOMERS BODY:', JSON.stringify(customersRes.body, null, 2));

        if (customersRes.body.length === 0) {
            console.log('⚠️ No customers returned. This might be why the dropdown is empty.');
        } else {
            console.log(`✅ Found ${customersRes.body.length} customers.`);
        }

    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

runTest();
