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
    let toSave: any[] = [];

    const localTaskById = new Map<string, ClientTask>()
    for (const t of ClientTask) {
        if (t.server_id) localTaskById.set(t.server_id, t)
    }

    for (const serverT of ServerTasks) {
        const local = localTaskById.get(serverT.id)
        if (local) {
            toSave.push({
                ...local,
                id: crypto.randomUUID(),
                server_id: serverT.id,
                is_delete: serverT.is_delete ? 1 : 0,
                update_date: serverT.update_date,
                version: serverT.version,
                synced: 1
            })
            continue
        }

        toSave.push(serverT)
    }
    await taskDb.saveMany(toSave)
    return toSave
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