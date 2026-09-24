import type { ClientTask } from '#/types/ClientTask'
import type { ServerTaskDTO } from '#/types/DTO'
import { toEpoch } from '#/utils/time'

export interface MergeDecision {
    local: ClientTask | null
    push: boolean
}

export interface ConflicPolicy {
    name: string
    resolve(local: ClientTask, server: ServerTaskDTO): MergeDecision
}

export const serverPriority: ConflicPolicy = {
    name: 'server-priority',
    resolve(local, server) {
        return {
            local: {
                ...local,
                server_id: server.id,
                label: server.label,
                is_done: server.is_done,
                is_delete: server.is_delete ? 1 : 0,
                update_date: server.update_date,
                version: server.version,
                synced: 1
            },
            push: false
        }
    }
}

export const localPriority: ConflicPolicy = {
    name: 'local-priority',
    resolve(local, _) {
        return {
            local: { ...local, synced: 0 },
            push: true
        }
    }
}

export const lastWriteWins: ConflicPolicy = {
    name: 'last-write-wins',
    resolve(local, server) {
        if (toEpoch(server.update_date) > toEpoch(local.update_date)) {
            return serverPriority.resolve(local, server)
        } else {
            return localPriority.resolve(local, server)
        }
    }
}