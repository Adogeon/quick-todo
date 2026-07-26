import pool from "../database.js";

export const getMany = async () => {
    const res = await pool.query('SELECT * FROM tasks');
    return res;
}
