import Express from "express";
import { type Response, type RequestHandler } from "express";
import { getAllTask, selectTaskById, updateTaskById, createNewTask, deleteTaskById, syncTask } from "../orm/task_query.js";
import { type AuthRequest } from "./auth.js";
const route = Express();

const authHandler = (handler: (req: AuthRequest, res: Response) => Promise<void | Response> | void | Response) => {
    return handler as RequestHandler
}

//get by id
route.get("/", authHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.user
    const result = await getAllTask(id);
    res.status(200).json(result);
}));

//get by id
route.get('/:id', authHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id parameter' })
        }

        const { id: userId } = req.user;

        const result = await selectTaskById(id ?? "", userId);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err })
    }
}))

//create 
route.post('/', authHandler(async (req: AuthRequest, res: Response) => {
    const { data } = req.body;
    const { id } = req.user;
    const result = await createNewTask(data, id);
    res.status(200).json(result);
}))

//update
route.put('/:id', authHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'Invalid id parameter' })
        }
        const { id: userId } = req.user;
        const { data } = req.body;
        const result = await updateTaskById(id, userId, data);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err })
    }
}))

//delete
route.delete('/:id', authHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid id parameter' })
    }
    const { id: userId } = req.user
    const result = await deleteTaskById(id, userId);
    res.status(200).json(result);
}))

//sync
route.post('/sync', authHandler(async (req: AuthRequest, res: Response) => {
    console.log("sync data received")
    try {
        const { id: userId } = req.user;
        const { tasks } = req.body
        console.log(tasks)
        if (!tasks || !Array.isArray(tasks)) {
            res.status(400).json({ error: 'Invalid request' })
            return
        }
        console.log(`Syncing ${tasks.length} tasks`)

        const result = await syncTask(tasks, userId)
        console.log(result)

        res.json({
            success: true,
            saved: result.saved,
            timestamp: Date.now()
        })
    } catch (err) {
        console.error('Sync error:', err);
        res.status(500).json({
            message: 'Sync error:' + err
        })
    }
}))

export default route;
