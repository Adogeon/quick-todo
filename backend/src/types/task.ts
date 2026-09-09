export interface ServerTask {
    id: string
    client_id: string
    user_id: string
    label: string
    is_done: boolean
    is_delete: boolean
    create_date: Date
    update_date: Date
    delete_at?: Date
    synced: boolean
    version: number
}

export interface TaskInput {
    client_id: string
    label: string
    is_done: boolean
    is_delete: boolean
    create_date: number
    update_date: number
    delete_at?: number
}

export interface SyncTaskInput {
    client_id: string
    server_id?: string
    label: string
    is_done: boolean
    is_delete: boolean
    create_date: number
    update_date: number
    delete_at?: number
}

