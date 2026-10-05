import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRESS_PASSWORD } = process.env;

const pool = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRESS_PASSWORD
})

export default pool;
