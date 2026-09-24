import type { UUID } from "crypto";

export interface BaseTask {
    label: string;
    is_done: boolean;
    create_date: string;
    update_date: string;
    version: number;
    delete_at?: string;
}
export interface ClientTask extends BaseTask {
    id: string;
    synced: number;
    is_delete: number;
    server_id?: string;
}

export interface TaskDOCommunicate extends BaseTask {
    client_id?: string;
    server_id?: string;
    is_delete: boolean;
}