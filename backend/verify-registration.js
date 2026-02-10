const http = require('http');

const data = JSON.stringify({
    name: 'Verification Startup ' + Date.now(),
    sector: 'Testing',
    geography: 'Global',
    description: 'Automated verification check'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/startups',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
        if (res.statusCode === 201) {
            console.log('VERIFICATION SUCCESSFUL');
            process.exit(0);
        } else {
            console.error('VERIFICATION FAILED');
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error('ERROR:', e.message);
    process.exit(1);
});

req.write(data);
req.end();
