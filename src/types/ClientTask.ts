import type { UUID } from "crypto";
import type BaseTask from "../../types/BaseTask";

export interface ClientTask extends BaseTask {
    id: UUID;
    synced: number;
    server_id?: string
}