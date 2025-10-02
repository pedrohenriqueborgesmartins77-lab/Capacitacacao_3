import bcrycpt from 'bcryptjs'
import { LoginUserInput, RegisterUserInput } from '../http/schemas/auth.schemas';
import { db } from '../lib/database';

import { randomUUID } from 'crypto';

export async function createUser(input: RegisterUserInput) {
    const hashedPassword = await bcrycpt.hash(input.password, 8);
    const id = randomUUID()

    const statement = db.prepare(
        'INSERT INTO users (id, username, password) VALUES (?, ?, ?)'
    );

    try {
        statement.run(id, input.username, hashedPassword)
        }catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('Este nome de usuário ja está em uso.')
        }
        throw error;
    }
}

export async function verifyUser(input: LoginUserInput) {
    const statement = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = statement.get(input.username) as any;

    if (!user) {
        throw new Error('Credenciais inválidas')
    }
    const isPasswordCorrect = await bcrycpt.compare( input.password, user.password);

    if(!isPasswordCorrect) {
        throw new Error('Credenciais inválidas');
    };    
    return user;
}