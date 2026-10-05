//Displaying sync status for syncing or done sync
import { useTodos } from '#/context/taskContext'

const SyncStatus = () => {
  const { isSyncing } = useTodos()
  return <>{isSyncing ? <div>Syncing... </div> : <span>Synced</span>} </>
}

export default SyncStatus
