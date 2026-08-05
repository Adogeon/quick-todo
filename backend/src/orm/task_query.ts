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
    const query = format("INSERT INTO Tasks (label) VALUES (%L)", task.label);
    const result = await client.query(query);
    client.release();
    return result.rows;

}

export const selectTaskById = async (id: string | string[]) => {
    try {
        const client = await pool.connect();
        const query = format("SELECT * FROM Tasks WHERE id= %L", id);
        const result = await client.query(query);
        client.release();
        if (result.rowCount && result.rowCount < 1) {
            throw Error(`Failed to find task with id ${id}`)
        }
        return result.rows[0];
    } catch (err) {
        throw err
    }
};


export const updateTaskById = async (id: string | string[], update: TaskUpdate) => {
    try {
        const client = await pool.connect();
        const query = format("UPDATE Tasks SET label=%L WHERE id=%L", update.label, id);
        const result = await client.query(query);
        if (result.rowCount && result.rowCount < 1) {
            throw Error(`Failed to find task with id ${id}`)
        }
        client.release();
        return result.rows;
    } catch (err) {
        throw err
    }
};

export const deleteTaskById = async (id: string | string[]) => {
    const client = await pool.connect();
    const query = format("DELETE FROM Tasks WHERE id=%L", id);
    const result = await client.query(query);
    client.release();
    return result.rows;
};
