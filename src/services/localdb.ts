export interface Task {
    id: string,
    label: string,
    isDone: boolean,
    createdAt: number
    updatedAt: number
    synced: boolean
    serverId?: string
}

class TaskDatabase {
    private dbName = "QuickTodoDB"
    private version = 1
    private db: IDBDatabase | null = null

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version)

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result

                if (!db.objectStoreNames.contains('tasks')) {
                    const store = db.createObjectStore('tasks', { keyPath: 'id' })

                    store.createIndex('synced', 'synced', { unique: false })
                    store.createIndex('createdAt', 'createdAt', { unique: false })
                    store.createIndex('updatedAt', 'updatedAt', { unique: false })
                }
            }

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result
                resolve(this.db)
            }

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error)
            }
        })
    }

    async getAll(): Promise<Task[]> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readonly')
            const store = transaction.objectStore('tasks')
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    async save(task: Task): Promise<void> {
        const db = await this.init()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readwrite')
            const store = transaction.objectStore('tasks')
            const request = store.put(task)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    async saveMany(tasks: Task[]): Promise<void> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readwrite')
            const store = transaction.objectStore('tasks')

            for (const task of tasks) {
                store.put(task)
            }

            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
        })
    }

    async delete(id: string): Promise<void> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readwrite')
            const store = transaction.objectStore('tasks')
            const request = store.delete(id)

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    async deleteAll(): Promise<void> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readwrite')
            const store = transaction.objectStore('tasks')
            const request = store.clear()

            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    async count(): Promise<number> {
        const db = await this.init()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('tasks', 'readwrite')
            const store = transaction.objectStore('tasks')
            const request = store.count()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    close(): void {
        if (this.db) {
            this.db.close()
            this.db = null
        }
    }
}

export const taskDb = new TaskDatabase()