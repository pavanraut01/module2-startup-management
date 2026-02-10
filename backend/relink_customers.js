const db = require('./src/config/db');

async function relink() {
    try {
        // Get the first startup (alphabetical by ID, or just generic select which usually follows insertion or ID)
        // We'll use the one that reproduce_issue.js found: 72155890-a41e-439d-9da4-23722c2d9e82
        // But to be dynamic, let's fetch one.
        const [startups] = await db.execute('SELECT id, name FROM startups LIMIT 1');

        if (startups.length === 0) {
            console.error('No startups found!');
            process.exit(1);
        }

        const targetStartupId = startups[0].id;
        console.log(`Linking customers to startup: ${targetStartupId} (${startups[0].name})`);

        const [result] = await db.execute('UPDATE customers SET startup_id = ?', [targetStartupId]);
        console.log(`Updated ${result.affectedRows} customers.`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

relink();
