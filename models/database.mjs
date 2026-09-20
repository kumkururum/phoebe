import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(`${import.meta.dirname}/main.db`);

const initDatabase = `

CREATE TABLE IF NOT EXISTS glyphs(
glyph_id TEXT PRIMARY KEY,
char_code TEXT NOT NULL UNIQUE,
image_link TEXT NOT NULL
);

`;

database.exec(initDatabase);

export default database;