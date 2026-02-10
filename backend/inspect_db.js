const db = require('./src/config/db');

async function inspect() {
    try {
        console.log('--- Startups ---');
        const [startups] = await db.execute('SELECT id, name FROM startups');
        console.table(startups);

        console.log('\n--- Customers ---');
        const [customers] = await db.execute('SELECT id, startup_id, name, status FROM customers');
        console.table(customers);

        if (customers.length === 0) {
            console.log('\n❌ No customers found in DB. Need to re-seed.');
        } else {
            console.log(`\n✅ Found ${customers.length} customers.`);
            // Check if any match the startups
            const startupIds = startups.map(s => s.id);
            const orphaned = customers.filter(c => !startupIds.includes(c.startup_id));
            if (orphaned.length > 0) {
                console.log(`⚠️ Found ${orphaned.length} orphaned customers (startup_id not found in startups table).`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

inspect();
