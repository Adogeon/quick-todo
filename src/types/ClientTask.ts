import type { UUID } from "crypto";
import type BaseTask from "../../types/BaseTask";

export interface ClientTask extends BaseTask {
    id: UUID;
    synced: number;
    is_delete: number;
    server_id?: string
}

export interface TaskDOCommunicate extends BaseTask {
    client_id?: string;
    server_id?: string;
    is_delete: boolean
}