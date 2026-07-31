import pool from '../database.js';

export const getAllTask = async () => {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM Tasks");
    client.release();
    return result.rows;
};