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
        console.log('1. Logging in...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email: 'auth@test.com', password: 'password123' });

        if (loginRes.status !== 200) throw new Error('Login failed: ' + JSON.stringify(loginRes.body));
        const token = loginRes.token || loginRes.body.token;
        const authHeader = { 'Authorization': `Bearer ${token}` };

        console.log('2. Fetching startups...');
        const startupsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/startups',
            method: 'GET',
            headers: authHeader
        });
        if (!startupsRes.body.length) throw new Error('No startups found');
        const sId = startupsRes.body[0].id;

        console.log('3. Fetching customers...');
        const customersRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/churn/customers/${sId}`,
            method: 'GET',
            headers: authHeader
        });
        if (!customersRes.body.length) throw new Error('No customers found');
        const cId = customersRes.body[0].id;

        console.log(`4. Logging churn for customer ${cId}...`);
        const churnRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/churn/log-event',
            method: 'POST',
            headers: { ...authHeader, 'Content-Type': 'application/json' }
        }, { customer_id: cId, churn_type: 'voluntary', reason: 'Verification Test' });

        console.log('CHURN RESULT:', churnRes.status, churnRes.body);

        console.log('5. Verifying metrics updated...');
        const metricsRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: `/api/churn/retention/${sId}`,
            method: 'GET',
            headers: authHeader
        });
        console.log('METRICS:', metricsRes.body);

        if (churnRes.status === 201) {
            console.log('✅ TEST PASSED');
        } else {
            console.log('❌ TEST FAILED');
        }
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

runTest();
