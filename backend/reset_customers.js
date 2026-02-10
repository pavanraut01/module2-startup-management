const db = require('./src/config/db');

async function reset() {
    try {
        console.log('Resetting all customers to ACTIVE status...');
        const [result] = await db.execute('UPDATE customers SET status = "active"');
        console.log(`Updated ${result.affectedRows} customers.`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

reset();
