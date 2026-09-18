import { taskDb } from "./localdb"
import { type ClientTask, type TaskDOCommunicate } from "#/types/ClientTask"

export const syncFromServer = async (token: string) => {
    const response = await fetch('/api/tasks/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })

    const result = await response.json()
    const ServerTasks = result.tasks
    const ClientTask = await taskDb.getAll()
    let newTasks: any[] = [];
    let newTrashes: any[] = [];

    for (const task of ServerTasks) {
        const newTask = ClientTask.find((t) => t.id !== task.client_id);
        if (newTask !== undefined) {
            const updated = {
                ...task,
                synced: 1,
            }
            if (updated.is_delete) {
                newTrashes.push(updated)
            } else {
                newTasks.push(updated)
            }
            await taskDb.save(updated)
        }
    }

    return { newTrashes, newTasks }
}

export const syncToServer = async (token: string) => {
    const unsynced: ClientTask[] = await taskDb.getUnsync()

    if (!unsynced || unsynced.length === 0) {
        console.log('Nothing to sync')
        return
    }

    const sync_payload: TaskDOCommunicate[] = unsynced.map((task): TaskDOCommunicate => {
        const { synced, id, ...TaskDO } = task;
        return { ...TaskDO, client_id: task.id, is_delete: task.is_delete === 1 }
    })

    const response = await fetch('/api/tasks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ tasks: sync_payload })
    })

    if (!response.ok) {
        throw new Error('Sync Failed');
    }
    const severResult = await response.json()
    const severTasks = severResult.saved;
    for (const todo of unsynced) {
        const syncedTask = severTasks.find((t: any) => t.client_id === todo.id)

        const updated = {
            ...todo,
            synced: 1,
            server_id: syncedTask.id
        }
        await taskDb.save(updated)
    }
}

let syncInterval: NodeJS.Timeout | null = null
export const startSync = (token: string, intervalMs: number = 1800000) => {
    if (syncInterval) {
        clearInterval(syncInterval)
        syncInterval = null
    }
    console.log("Sync started")
    syncToServer(token)
    syncInterval = setInterval(() => { syncToServer(token) }, intervalMs)
}

export const stopSync = () => {
    if (syncInterval) {
        clearInterval(syncInterval)
        syncInterval = null
        console.log('Sync stopped')
    }
}