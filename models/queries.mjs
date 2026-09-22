import database from "./database.mjs";

const registerGlyph = database.prepare(`
    INSERT INTO glyphs (char_code, image_link, meaning)
    VALUES (?, ?, ?)
    RETURNING glyph_id, char_code, image_link, meaning
    `);

const getGlyphByCode = database.prepare(`
    SELECT * FROM glyphs WHERE char_code = ?
    `);

const getGlyphAll = database.prepare(`
    SELECT * FROM glyphs

    `)

const countGlyphs = database.prepare(`
    SELECT COUNT (glyph_id)
    FROM glyphs
    `);

export { registerGlyph, getGlyphByCode, countGlyphs, getGlyphAll };
