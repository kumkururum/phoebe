import database from "./database.mjs";

const registerGlyph = database.prepare(`
    INSERT INTO glyphs (glyph_id, char_code, image_link)
    VALUES (?, ?, ?)
    RETURNING glyph_id, char_code, image_link
    `);

const getGlyphByCode = database.prepare(`
    SELECT * FROM glyphs WHERE char_code = ?
    `);

export { registerGlyph, getGlyphByCode };
