import { taskDb } from "../localdb";
import { pullFromServer } from "./pull";
import { pushToServer } from "./push";
import { lastWriteWins, type ConflicPolicy } from "./policy";
import type { ClientTask } from "#/types/ClientTask";
import type { ServerTaskDTO } from "#/types/DTO";

export interface SyncOptions {
    policy?: ConflicPolicy
    onProgress?: (state: string) => void
}

const serverToClient = (task: ServerTaskDTO): ClientTask => {
    return {
        ...task,
        id: task.client_id ?? crypto.randomUUID(),
        server_id: task.id,
        is_delete: task.is_delete ? 1 : 0,
    }
}

export const syncWithServer = async (token: string, option: SyncOptions = {}) => {
    const policy = option.policy ?? lastWriteWins

    option.onProgress?.('pulling')
    const { tasks: serverTasks, purgeIds } = await pullFromServer(token)

    if (purgeIds.length > 0) {
        for (const id of purgeIds) {
            await taskDb.delete(id)
        }
    }

    option.onProgress?.('merging')
    const locals = await taskDb.getAll()
    const localByServerId = new Map<string, ClientTask>()
    for (const t of locals) {
        if (t.server_id) localByServerId.set(t.server_id, t)
    }

    const toSave: ClientTask[] = []
    const toRepush: string[] = []

    for (const server of serverTasks) {
        const local = localByServerId.get(server.id)

        if (local) {
            const decision = policy.resolve(local, server)
            if (decision.local) toSave.push(decision.local)
            if (decision.push) toRepush.push(local.id)
            continue
        }
        toSave.push(serverToClient(server))
    }
    await taskDb.saveMany(toSave)

    option.onProgress?.('pushing')
    await pushToServer(token)

    return {
        pulled: serverTasks.length,
        purged: purgeIds.length,
        merged: toSave.length,
        repushed: toRepush.length
    }
}