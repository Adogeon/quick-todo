interface BaseTask {
    label: string,
    user_id: string,
    is_done: boolean,
    create_date: string,
    update_date: string,
    version: number,
    is_delete: boolean,
}
export interface ServerTask extends BaseTask {
    id: string
    client_id?: string
    is_delete: boolean
    delete_at?: string
    synced: boolean
}

export interface ClientTaskDTO extends BaseTask {
    server_id?: string
    client_id: string
    delete_at?: string
}


