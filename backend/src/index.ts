import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import taskRoute from "./routes/task_route.js";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tasks/', taskRoute);

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        status: 'Ok', message: 'Backend is running'
    });
});

app.get('/api/test', (_req: Request, res: Response) => {
    res.json({
        message: 'Hello World!'
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
