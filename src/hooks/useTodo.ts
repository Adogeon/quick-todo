import { useState, useEffect, useMemo, useCallback } from 'react'
import { taskDb } from '#/services/localdb'
import { type ClientTask } from '#/types/ClientTask'

export function useTodos() {
    const [tasks, setTasks] = useState<ClientTask[]>([]);
    const [trash, setTrash] = useState<ClientTask[]>([]);

    const loadActive = async () => {
        try {
            const active = await taskDb.getActive()
            active.sort((a, b) => b.create_date - a.create_date)
            setTasks(active)
        } catch (error) {
            console.error("Failled to load tasks: " + error)
        }
    }

    const loadTrash = async () => {
        try {
            const trashTask = await taskDb.getDelete()
            setTasks(trashTask)
        } catch (error) {
            console.error("Failed to load trash: " + error)
        }
    }

    const addTodo = useCallback(async (text: string) => {
        let newTaskObj: ClientTask = {
            id: crypto.randomUUID(),
            label: text,
            is_done: false,
            create_date: Date.now(),
            update_date: Date.now(),
            is_delete: 0,
            synced: 0,
        }

        try {
            setTasks((prev) => [newTaskObj, ...prev])
            await taskDb.save(newTaskObj)
        } catch (error) {
            console.error('failed to add todo: ', error)
        }

    }, [])

    const toggleTodo = useCallback(async (id: string) => {
        try {
            let taskObj: ClientTask | undefined = tasks.find(
                (t) => t.id === id,
            )
            if (!taskObj) throw Error("Can't find the task with id")
            const update = {
                ...taskObj,
                is_done: !taskObj.is_done,
                synced: 0,
                update_date: Date.now(),
            }
            await taskDb.save(update)
            setTasks((prev) => prev.map((t) => (t.id === update.id ? update : t)))
        } catch (error) {
            console.log('Faild to update task:', error)
        }
    }, [tasks])

    const deleteTodo = useCallback(async (id: string) => {
        try {
            let taskObj: ClientTask | undefined = tasks.find(
                (t) => t.id === id,
            )
            if (!taskObj) throw Error("Can't find the task with id")
            const update = {
                ...taskObj,
                is_delete: 1,
                synced: 0,
                update_date: Date.now(),
            }
            await taskDb.save(update)
            setTasks((prev) => prev.filter((t) => t.id !== id))
            setTrash((prev) => [update, ...prev])
        } catch (error) {
            console.log('Failed to delete task:', error)
        }
    }, [tasks])

    const restoreTodo = useCallback(async (id: string) => {
        try {
            let taskObj: ClientTask | undefined = trash.find(
                (t) => t.id === id,
            )
            if (!taskObj) throw Error("Can't find the task with id")
            const update = {
                ...taskObj,
                is_delete: 0,
                synced: 0,
                update_date: Date.now(),
            }
            await taskDb.save(update)
            setTrash((prev) => prev.filter((t) => t.id !== id))
            setTasks((prev) => [update, ...prev])
        } catch (error) {
            console.log('Failed to delete task:', error)
        }
    }, [trash])

    const permanentDelete = useCallback(async (id: string) => {
        setTrash(prev => prev.filter(t => t.id !== id))
    }, [])

    return {
        tasks,
        trash,
        loadActive,
        loadTrash,
        addTodo,
        toggleTodo,
        deleteTodo,
        restoreTodo,
        permanentDelete
    }
}