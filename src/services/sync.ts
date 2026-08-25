import { taskDb } from "./localdb"
import { type ClientTask, type TaskDOCommunicate } from "#/types/ClientTask"

export const syncToServer = async () => {
    const unsynced: ClientTask[] = await taskDb.getUnsync()

    if (!unsynced || unsynced.length === 0) {
        console.log('Nothing to sync')
        return
    }

    const sync_payload: TaskDOCommunicate[] = unsynced.map((task): TaskDOCommunicate => {
        const { synced, id, ...TaskDO } = task;
        return { ...TaskDO, client_id: task.id }
    })

    const response = await fetch('/api/tasks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: sync_payload })
    })

    if (!response.ok) {
        throw new Error('Sync Failed');
    }
    const severResult = await response.json()
    const severTasks = severResult.saved;
    for (const todo of unsynced) {
        console.log(todo)
        console.log(severTasks)
        const syncedTask = severTasks.find((t: any) => t.client_id === todo.id)

        console.log(syncedTask)

        const updated = {
            ...todo,
            synced: 1,
            server_id: syncedTask.id
        }
        await taskDb.save(updated)
    }
}

let syncInterval: NodeJS.Timeout | null = null
export const startSync = (intervalMs: number = 30000) => {
    if (syncInterval) {
        clearInterval(syncInterval)
        syncInterval = null
    }
    console.log("Sync started")
    syncToServer()
    syncInterval = setInterval(syncToServer, intervalMs)
}

export const stopSync = () => {
    if (syncInterval) {
        clearInterval(syncInterval)
        syncInterval = null
        console.log('Sync stopped')
    }
}