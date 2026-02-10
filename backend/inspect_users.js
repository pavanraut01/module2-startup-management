const db = require('./src/config/db');

async function inspectUsers() {
    try {
        console.log('--- Users ---');
        const [users] = await db.execute('SELECT id, first_name, last_name, email FROM users');
        console.table(users);

        console.log('\n--- Roles ---');
        const [roles] = await db.execute('SELECT * FROM roles');
        console.table(roles);

        console.log('\n--- User Roles ---');
        const [userRoles] = await db.execute('SELECT * FROM user_roles');
        console.table(userRoles);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

inspectUsers();
