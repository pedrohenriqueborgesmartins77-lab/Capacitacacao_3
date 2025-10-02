import { db } from "../lib/database";

interface AssociateCnpjNameInput {
    cnpj: string;
    name: string;
    userId: string;
}

export async function associateCnpjName(input: AssociateCnpjNameInput) {
    const statement = db.prepare(`
        INSERT INTO cnpj_names (cnpj, name, userId)
        VALUES (?, ?, ?)
        ON CONFLICT(cnpj) DO UPDATE SET
            name = excluded.name,
            userId = excluded.userId
        `);

        try {
            statement.run(input.cnpj, input.name, input.userId);
            console.log(`Associação salva: CNPJ ${input.cnpj} -> Nome ${input.name}`);
        }catch (error) {
            console.error('Erro ao salvar associação CNPJ-Nome:', error);
            throw new Error('Não foi possível associar o nome ao CNPJ.');
        }
}

export async function findCnpj(cnpj: string) {
    const statement = db.prepare('SELECT * FROM cnpj_names WHERE cnpj = ?');    

    const result = statement.get(cnpj)

    return(result);
}