import pool from "../src/database";

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW() as time');
        console.log("Connected to PostgreSQL!");
        console.log("Server time", result.rows[0].time);
        await pool.end();
    } catch (err) {
        console.error("Connection failed", err);
    }
}

testConnection();