import { type ServerTaskDTO } from "#/types/DTO";

export interface PullResult {
    tasks: ServerTaskDTO[]
    purgeIds: string[]
}

export const pullFromServer = async (token: string): Promise<PullResult> => {
    const response = await fetch(`/api/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(`Pull failed: ${response.status}`)
    }

    const result = await response.json()
    return {
        tasks: Array.isArray(result.tasks) ? result.tasks : [],
        purgeIds: Array.isArray(result.purgeIds) ? result.purgeIds : []
    }
}