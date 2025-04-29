import jwt from 'jsonwebtoken'
import env from 'dotenv'
import { buildResponse } from './responses'

env.config()

const jwtkey = process.env.JWTKEY || "Without jwt key"

// Geração de Token
export function GenerateToken(user: any) {
    try {
        const token = jwt.sign({ id: user._id }, jwtkey, { expiresIn: '300h' });
        return buildResponse('Token generated successfully', true, token);
    } catch (err) {
        console.error('JWT Generation Error:', err);
        return buildResponse('Error generating token', false);
    }
}


// Middleware de autenticação

export const middleware = (req: any, res: any, next: any) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token is missing' });
    }
    jwt.verify(token, jwtkey, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalid' });
        }
        req.id = decoded.id;  
        next(); 
    });
};
