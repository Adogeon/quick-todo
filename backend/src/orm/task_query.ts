import pool from '../database.js';
import format from 'pg-format';
import { type ServerTask, type SyncTaskInput, type TaskInput } from '../types/task.js'

export const getAllTask = async (userId: string) => {
    const client = await pool.connect()
    try {
        const result = await client.query("SELECT * FROM Tasks WHERE user_id=$1", [userId]);
        return result.rows as ServerTask[];
    } finally {
        client.release();
    }
};

export const createNewTask = async (task: TaskInput, userId: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query("INSERT INTO Tasks (label, user_id) VALUES ($1, $2)", [task.label, userId]);
        return result.rows[0] as ServerTask | undefined;
    } finally {
        client.release();

    }
}

export const createManyTask = async (tasks: SyncTaskInput[], userId: string) => {
    if (tasks.length === 0) return []

    const values = tasks.map((t) => [
        t.client_id,
        t.label,
        userId,
        t.is_done,
        t.is_delete,
        new Date(t.create_date),
    ])

    const query = format(`INSERT INTO tasks (client_id, label, user_id, is_done, is_delete, create_date) VALUES %L RETURNING id, client_id, version`, values)
    const client = await pool.connect();
    try {
        const result = await client.query(query);
        return result.rows as ServerTask[]
    } finally {
        client.release()
    }
}

export const selectTaskById = async (id: string, userId: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "SELECT * FROM Tasks WHERE id= $1 AND user_id = $2",
            [id, userId]
        );

        return result.rows[0] as ServerTask | undefined;
    } finally {
        client.release();
    }
};

type TaskUpdate = Partial<Pick<TaskInput, 'label' | 'is_done' | 'is_delete'>>
export const updateTaskById = async (id: string, userId: string, update: TaskUpdate) => {
    const fields: string[] = []
    const values: any[] = []

    const allowedFields = ['label', 'is_done', 'is_delete']

    for (const [key, value] of Object.entries(update)) {
        if (allowedFields.includes(key) && value !== undefined) {
            fields.push(`${key} = %L`)
            values.push(value)
        }
    }

    fields.push(`update_date = CURRENT_TIMESTAMP`)
    fields.push(`version = version + 1`)

    if (update.is_delete === true) {
        fields.push(`delete_at = CURRENT_TIMESTAMP`)
    } else if (update.is_delete === false) {
        fields.push(`delete_at = NULL`)
    }

    if (fields.length === 0) {
        throw new Error("No valid update")
    }

    const query = format(
        `UPDATE Tasks
        SET ${fields.join(', ')}
        WHERE id = %L AND user_id = %L
        RETURNING *`,
        ...values, id, userId
    )

    const client = await pool.connect();
    try {
        const result = await client.query(query);
        return result.rows[0] as ServerTask | undefined;
    } finally {
        client.release();
    }
};

type ManyUpdateReturn = Pick<ServerTask, 'id' | 'client_id' | 'version'>
export const updateManyTask = async (tasks: SyncTaskInput[], userId: string) => {
    if (tasks.length === 0) return []

    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        const updated = []
        for (const task of tasks) {
            if (task.server_id) {
                const result = await client.query(
                    `UPDATE tasks 
                    SET label = $1, is_done = $2, update_date=$3, is_delete: $4, client_id:$5 version = version + 1
                    WHERE id = $6 AND user_id = $7
                    RETURNING id, client_id, version`,
                    [task.label, task.is_done, new Date(task.update_date), task.is_delete, task.client_id, task.server_id, userId]
                )

                if (result.rows.length > 0) {
                    updated.push(result.rows[0] as ManyUpdateReturn[])
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

export const deleteTaskById = async (id: string, userId: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "DELETE FROM Tasks WHERE id=$1 AND user_id = $2 RETURNING id",
            [id, userId]
        );
        if (result.rows.length === 0) {
            throw new Error(`Task ${id} not found or access denied`)
        }
        return result.rows[0].id;
    } finally {
        client.release();
    }
};

export const syncTask = async (tasks: SyncTaskInput[], userId: string) => {
    if (tasks.length === 0) return { saved: [] }

    const toCreate: TaskInput[] = []
    const toUpdate: TaskInput[] = []

    for (const task of tasks) {
        if (task.server_id) {
            toUpdate.push(task)
        } else {
            toCreate.push(task)
        }
    }

    const saved = []
    if (toCreate.length > 0) {
        const created = await createManyTask(toCreate, userId)
        saved.push(...created)
    }

    if (toUpdate.length > 0) {
        const updated = await updateManyTask(toUpdate, userId)
        saved.push(...updated)
    }

    console.log(saved)

    return { saved }
}
