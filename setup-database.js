const pool = require('./database');

const setupDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Drop the table if it exists
        await client.query('DROP TABLE IF EXISTS flavors');

        // Create the flavors table
        await client.query(`
            CREATE TABLE flavors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                is_favorite BOOLEAN NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed the table with sample data
        await client.query(`
            INSERT INTO flavors (name, is_favorite)
            VALUES
            ('Vanilla', true),
            ('Chocolate', false),
            ('Strawberry', true)
        `);

        await client.query('COMMIT');
        console.log('Database setup complete');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error setting up database', err);
    } finally {
        client.release();
    }
};

setupDatabase().catch(console.error);