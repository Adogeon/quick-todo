import Express from "express";
import { type Request, type Response } from "express";
import { getAllTask, selectTaskById, updateTaskById, createNewTask, deleteTaskById } from "../orm/task_query.js";

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

export default route;
