import { taskDb } from "./localdb"
import { type ClientTask } from "#/types/ClientTask"

export const syncToServer = async () => {
    const unsynced: ClientTask[] = await taskDb.getUnsync()

    console.log(unsynced)

    if (!unsynced || unsynced.length === 0) {
        console.log('Nothing to sync')
        return
    }

    const response = await fetch('/api/todos/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todos: unsynced })
    })

    if (!response.ok) {
        throw new Error('Sync Failed');
    }

    const severTasks = await response.json()

    for (const todo of unsynced) {

        const syncedTask = severTasks.find((t: any) => t.localId === todo.id)

        const updated = {
            ...todo,
            synced: 1,
            serverId: syncedTask.id
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