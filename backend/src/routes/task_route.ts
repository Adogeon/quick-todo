import Express from "express";
import { type Request, type Response } from "express";
import { getAllTask } from "../orm/task_query.js";

const route = Express();

//get by id
route.get("/", async (req: Request, res: Response) => {
    const result = await getAllTask();
    res.status(200).json(result);
});

//get all within parameter

//create 

//update

//delete

export default route;
