import type { UUID } from "crypto";

export interface BaseTask {
    label: string;
    is_done: boolean;
    create_date: number;
    update_date: number;
    version: number;
}
export interface ClientTask extends BaseTask {
    id: UUID;
    synced: number;
    is_delete: number;
    server_id?: string;
}

export interface TaskDOCommunicate extends BaseTask {
    client_id?: string;
    server_id?: string;
    is_delete: boolean
}