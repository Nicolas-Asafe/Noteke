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
    // Verificar se o token foi passado no cabeçalho Authorization
    const token = req.headers['authorization']?.split(' ')[1]; // Pega o token após "Bearer"
    console.log(token)
    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    // Verificar e decodificar o token JWT
    jwt.verify(token, jwtkey, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Inserir o ID do usuário no req para uso posterior
        req.id = decoded.id;  // O 'id' deve ser passado no payload do token
        next();  // Passa para o próximo middleware ou rota
    });
};
