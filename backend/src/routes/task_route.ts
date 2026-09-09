import Express from "express";
import { type Response } from "express";
import { getAllTask, selectTaskById, updateTaskById, createNewTask, deleteTaskById, syncTask } from "../orm/task_query.js";
import { type AuthRequest } from "./auth.js";
const route = Express();

//get by id
route.get("/", async (req: AuthRequest, res: Response) => {
    const result = await getAllTask();
    res.status(200).json(result);
});

//get by id
route.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await selectTaskById(id ?? "");
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err })
    }
})

//create 
route.post('/', async (req: AuthRequest, res: Response) => {
    const { data } = req.body;
    const result = await createNewTask(data);
    res.status(200).json(result);
})

//update
route.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const result = await updateTaskById(id ?? "", data);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err })
    }
})

//delete
route.delete('/:id', async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await deleteTaskById(id ?? "");
    res.status(200).json(result);
})

//sync
route.post('/sync', async (req: AuthRequest, res: Response) => {
    console.log("sync data received")
    try {
        const { tasks } = req.body
        console.log(tasks)
        if (!tasks || !Array.isArray(tasks)) {
            res.status(400).json({ error: 'Invalid request' })
            return
        }
        console.log(`Syncing ${tasks.length} tasks`)

        const result = await syncTask(tasks)
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
})
export default route;
