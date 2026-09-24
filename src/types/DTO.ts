import { type BaseTask } from "./ClientTask";

export interface ServerTaskDTO extends BaseTask {
    is_delete: boolean
    client_id?: string
    id: string
    synced: number
}

