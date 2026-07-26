import Express from "express";
import { type Request, type Response } from "express";
import { getMany } from "../orm/task_query.js";

let route = Express();

//get by id
route.get("/", async (req: Request, res: Response) => {
    const result = await getMany();
    res.json(result);
});

//get all within parameter

//create 

//update

//delete

export default route;
