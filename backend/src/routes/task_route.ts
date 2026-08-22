import Express from "express";
import { type Request, type Response } from "express";
import { getAllTask, selectTaskById, updateTaskById, createNewTask, deleteTaskById, syncTask } from "../orm/task_query.js";

const route = Express();

//get by id
route.get("/", async (req: Request, res: Response) => {
    const result = await getAllTask();
    res.status(200).json(result);
});

//get by id
route.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await selectTaskById(id ?? "");
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ error: err })
    }
})

//create 
route.post('/', async (req: Request, res: Response) => {
    const { data } = req.body;
    const result = await createNewTask(data);
    res.status(200).json(result);
})

//update
route.put('/:id', async (req: Request, res: Response) => {
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
route.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteTaskById(id ?? "");
    res.status(200).json(result);
})

//sync
route.post('/sync', async (req: Request, res: Response) => {
    try {
        const { tasks } = req.body
        if (!tasks || !Array.isArray(tasks)) {
            res.status(400).json({ error: 'Invalid request' })
            return
        }
        console.log(`Syncing ${tasks.length} tasks`)

        const result = await syncTask(tasks)

        res.json({
            success: true,
            saved: result.saved,
            timestamp: Date.now()
        })
    } catch (err) {
        console.error('Sync error:', err);
        res.status(500).json({
            err
        })
    }
})
export default route;
