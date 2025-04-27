import jwt from 'jsonwebtoken'
import env from 'dotenv'
import { buildResponse } from './responses'

env.config()

const jwtkey = process.env.JWTKEY || "Without jwt key"
 
export function GenerateToken(id: string) {
    try {
        const token = jwt.sign({ id }, jwtkey, { expiresIn: '300h' })
        return buildResponse('Token generated successfully', true, token)
    } catch (err) {
        console.error('JWT Generation Error:', err)
        return buildResponse('Error generating token', false)
    }
}
 
export function middleware(req: any, res: any, next: any) {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 
        
        if (!token) {
            return res.status(401).json(buildResponse('Token not exists', false));
        }


        const verify = jwt.verify(token, jwtkey);
        if (!verify) {
            return res.status(401).json(buildResponse('Your token is incorrect', false));
        }


        const decoded = jwt.decode(token);
        if (decoded && typeof decoded === 'object') {
            req.id = decoded.id; 
            next(); 
        } else {
            return res.status(401).json(buildResponse('Token is invalid', false));
        }
    } catch (err) {
        console.error('JWT Verification Error:', err);
        return res.status(401).json(buildResponse('Error verifying token', false));
    }
}
