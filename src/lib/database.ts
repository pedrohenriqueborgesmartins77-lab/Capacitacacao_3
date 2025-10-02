import Database from 'better-sqlite3';
import fs from 'fs';

const DB_PATH = './migrations';
const DB_FILE = `${DB_PATH}/app.db`;

if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true })
}

export const db : any = new Database(DB_FILE)

const setupDatabase = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
    `);


    db.exec(`
        CREATE TABLE IF NOT EXISTS cnpj_names (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cnpj TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          userId INTEGER,
          FOREIGN KEY (userId) REFERENCES users(id)
        );
    `);
    console.log('📦 Banco de dados e tabelas verificados com sucesso.')
};
setupDatabase();