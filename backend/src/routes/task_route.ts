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
    //const requet_id = req.params.id ?? "";
    //const result = await selectTaskById(requet_id);
    //res.status(200).json(result);

})

//create 

//update

//delete

export default route;
