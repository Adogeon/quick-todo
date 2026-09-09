import { Router, type Request, type Response, type NextFunction } from 'express'
import { createNewUser, verifyUser } from '../orm/user_query.js';
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: {
        id: string
    }
}

export const tokenDecodeMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: string };
        req.user = { id: user.userId }
        next()
    } catch (error) {
        res.status(401).json({ error: "Failed to authenticate token" })
    }
}

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Email and password required' })
    }

    const result = await createNewUser({ username, password });

    const token = jwt.sign(
        { userId: result.id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '3d' }
    )

    res.json({
        token
    })
})

router.post('/signin', async (req: Request, res: Response) => {
    const { username, password } = req.body
    const result = await verifyUser({ username, password })

    if (!result.is_verify) {
        return res.status(401).json({ error: result.error })
    }

    const token = jwt.sign(
        { userId: result.user_id },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '3d' }
    )

    res.json({ token })
})

export default router;