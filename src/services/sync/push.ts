import { taskDb } from '#/services/localdb'
import type { TaskDOCommunicate } from '#/types/ClientTask'

export const pushToServer = async (token: string): Promise<number> => {
    const unsynced = await taskDb.getUnsync();
    if (!unsynced || unsynced.length === 0) return 0

    const payload: TaskDOCommunicate[] = unsynced.map((task) => {
        const { synced, id, ...rest } = task
        return {
            ...rest,
            client_id: task.id,
            is_delete: task.is_delete === 1
        }
    })

    const response = await fetch(`/api/tasks/synce`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tasks: payload })
    })

    const { saved } = await response.json()

    for (const task of unsynced) {
        const syncedTask = saved.find((t: any) => t.client_id === task.id)
        if (syncedTask) {
            await taskDb.save({
                ...task,
                synced: 1,
                server_id: syncedTask.id
            })
        }
    }

    return unsynced.length
}