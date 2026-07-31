import pool from '../database.js';
import format from 'pg-format';

export interface TaskUpdate {
    label: string
}

export const getAllTask = async () => {
    const client = await pool.connect()
    const result = await client.query("SELECT * FROM Tasks");
    client.release();
    return result.rows;
};

export const createNewTask = async (task: TaskUpdate) => {
    const client = await pool.connect();
    const query = format("INSERT INTO Task (label) VALUES (%L)", task.label);
    const result = await client.query(query);
    client.release();
    return result.rows;

}

export const selectTaskById = async (id: string) => {
    const client = await pool.connect();
    const query = format("SELECT * FROM Tasks WHERE id= %L", id);
    const result = await client.query(query);
    client.release();
    return result.rows[0];
};


export const updateTaskById = async (id: string, update: TaskUpdate) => {
    const client = await pool.connect();
    const query = format("UPDATE Tasks SET label=%L WHERE id=%L", update.label, id);
    const result = await client.query(query);
    client.release();
    return result.rows;
};

export const deleteTaskById = async (id: string) => {
    const client = await pool.connect();
    const query = format("DELETE FROM Tasks WHERE id=%L", id);
    const result = await client.query(query);
    client.release();
    return result.rows;
};
