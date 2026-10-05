import { Router, type Request, type Response, type NextFunction } from 'express'
import { createNewUser, isUserExist, verifyUser } from '../orm/user_query.js';
import jwt from 'jsonwebtoken'

const TOKEN_TTL = '3d'

const isValidUsername = (u: unknown): u is string => {
    return typeof u === 'string' && u.length >= 3 && u.length <= 50
}

const isValidPassword = (u: unknown): u is string => {
    return typeof u === 'string' && u.length >= 8 && u.length <= 100
}

const signToken = (id: string) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: TOKEN_TTL })
}

export interface AuthRequest extends Request {
    user: {
        id: string
    }
}

export const tokenDecodeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: string }
        req.user = { id: payload.userId }
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ error: "Invalid or expired token" })
    }
}

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        if (!isValidUsername(username)) {
            return res.status(400).json({
                error: "Username is not valid"
            })
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                error: "Password is not valid"
            })
        }

        const result = await createNewUser({ username, password });
        if (!result) {
            return res.status(400).json({ error: "Username already exists" })
        }
        const token = signToken(result.id)
        res.status(201).json({
            token
        })
    } catch (error) {
        console.error('Sign up error: ', error)
        return res.status(500).json({ error: 'Signup failed' })
    }
})

router.post('/signin', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.status(400).json({ error: 'Invalid credentials format' })
        }
        const result = await verifyUser({ username, password })

        if (!result.is_verify) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const token = signToken(result.user_id)
        res.json({ token })
    } catch (error) {
        console.error("Signin error:", error)
        return res.status(500).json({ error: 'Signin failed' })
    }
})

router.post('/verify', async (req: Request, res: Response) => {
    try {
        const { token } = req.body

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Token required' })
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { userId: string }

        const userExist = await isUserExist(payload.userId);
        if (!userExist) {
            return res.status(401).json({ error: "User no longer exists" })
        }
        const newToken = signToken(payload.userId)
        return res.status(200).json({ newToken })

    } catch (error) {
        console.error('Verify error:', error)
        return res.status(401).json({ error: "Invalid or expired token" })
    }
})

export default router;