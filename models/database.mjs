import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync(`${import.meta.dirname}/main.db`);

const initDatabase = `

CREATE TABLE IF NOT EXISTS glyphs(
glyph_id INTEGER PRIMARY KEY,
char_code TEXT NOT NULL UNIQUE,
meaning TEXT, 
image_link TEXT NOT NULL
);

`;

database.exec(initDatabase);

export default database;