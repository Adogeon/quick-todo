import pool from '../database.js';
import format from 'pg-format';

export interface TaskUpdate {
    label: string
}

export interface TaskInput {
    client_id: string
    id?: string
    label: string
    is_done: boolean
    is_delete: boolean
    create_date: number
    update_date: number
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

export const createManyTask = async (tasks: TaskInput[]) => {
    if (tasks.length === 0) return []

    const values = tasks.map((t) => [
        t.client_id,
        t.label,
        t.is_done,
        t.is_delete,
        new Date(t.create_date),
        new Date(t.update_date)
    ])

    const query = format(`INSERT INTO tasks (client_id, label, is_done, is_delete, create_date, update_date) VALUES %L RETURNING id, client_id, version`, values)
    const client = await pool.connect();
    const result = await client.query(query);
    client.release()
    return result.rows
}

export const selectTaskById = async (id: string | string[]) => {
    const client = await pool.connect();
    const query = format("SELECT * FROM Tasks WHERE id= %L", id);
    const result = await client.query(query);
    client.release();
    if (result.rowCount && result.rowCount < 1) {
        throw Error(`Failed to find task with id ${id}`)
    }
    return result.rows[0];
};


export const updateTaskById = async (id: string | string[], update: TaskUpdate) => {
    const client = await pool.connect();
    const query = format("UPDATE Tasks SET label=%L WHERE id=%L", update.label, id);
    const result = await client.query(query);
    if (result.rowCount && result.rowCount < 1) {
        throw Error(`Failed to find task with id ${id}`)
    }
    client.release();
    return result.rows;
};

export const updateManyTask = async (tasks: TaskInput[]) => {
    if (tasks.length === 0) return []

    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        const updated = []
        for (const task of tasks) {
            if (task.id) {
                const result = await client.query(
                    `UPDATE tasks 
                    SET label = $1, is_done = $2, update_date=$3, is_delete: $4 version = version + 1
                    WHERE id = $5
                    RETURNING id, client_id, version`,
                    [task.label, task.is_done, new Date(task.update_date), task.is_delete, task.id]
                )

                if (result.rows.length > 0) {
                    updated.push(result.rows[0])
                }
            }
        }

        await client.query('COMMIT')
        return updated
    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Transaction faile:", error)
        throw error
    } finally {
        client.release()
    }

}

export const deleteTaskById = async (id: string | string[]) => {
    const client = await pool.connect();
    const query = format("DELETE FROM Tasks WHERE id=%L", id);
    const result = await client.query(query);
    client.release();
    return result.rows;
};

export const syncTask = async (tasks: TaskInput[]) => {
    console.log(tasks)
    if (tasks.length === 0) return { saved: [] }

    const toCreate: TaskInput[] = []
    const toUpdate: TaskInput[] = []

    for (const task of tasks) {
        if (task.id) {
            toUpdate.push(task)
        } else {
            toCreate.push(task)
        }
    }

    const saved = []
    if (toCreate.length > 0) {
        const created = await createManyTask(toCreate)
        saved.push(...created)
    }

    if (toUpdate.length > 0) {
        const updated = await updateManyTask(toUpdate)
        saved.push(...updated)
    }

    console.log(saved)

    return { saved }
}
