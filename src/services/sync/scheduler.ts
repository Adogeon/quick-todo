import { syncWithServer } from "./organizer";
import { pushToServer } from "./push";

export function triggerPush(token: string, cb: () => void = () => { }): void {
    setInterval(
        async () => {
            try {
                await pushToServer(token);
                cb();
            } catch (err) {
                console.error(err)
            }
        }, 30_000)
}

let syncInterval: NodeJS.Timeout | null = null
export function startSync(token: string, intervalMs: number = 1770000) {
    if (syncInterval) {
        clearInterval(syncInterval)
        syncInterval = null
    }
    console.log("Sync started")
    syncInterval = setInterval(() => { syncWithServer(token) }, intervalMs)
}

export const stopSync = () => {
    if (syncInterval) {
        clearInterval(syncInterval)
        console.log('Sync stopped')
    }
}