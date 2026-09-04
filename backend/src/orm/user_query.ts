import pool from "../database.js"
import bcrypt from 'bcrypt'

interface AuthData {
    username: string,
    password: string
}

export const createNewUser = async (user: AuthData) => {
    const hash = await bcrypt.hash(user.password, 10)
    const client = await pool.connect();
    const result = await client.query("INSERT INTO users(username, hash) VALUES ($1, $2) RETURNING id", [user.username, hash]);
    client.release();
    return result.rows[0];
}

export const verifyUser = async (user: AuthData) => {
    const client = await pool.connect();
    const result = await client.query("SELECT id, username, hash FROM users WHERE username = $1", [user.username])
    client.release();

    if (result.rows.length === 0) {
        return { is_verify: false, error: "Invalid credentials" }
    }

    const valid = await bcrypt.compare(user.password, result.rows[0].hash)

    if (!valid) {
        return { is_verify: false, error: "Invalid credentials" }
    }

    return { is_verify: true, user_id: result.rows[0].id };
}