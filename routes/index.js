const express = require("express");
const router = express.Router();

const encoder_controller = require("../controllers/encoderController");
const dictionary_controller = require("../controllers/dictionaryController");
const { countGlyphs, getGlyphByCode } = require("../models/queries.mjs");

/* GET home page. */
router.get("/", function (req, res, next) {
  const tally = countGlyphs.get()[`COUNT (glyph_id)`]; //SOMEBODY NEEDS TO FIX THIS AWFUL IMPLEMENTATION, LIKELY ME
  const glyph = getGlyphByCode.get("tori");
  console.log(tally);
  res.render("index", { nglyphs: tally, glyph: glyph });
});

/* GET Encoder page */
router.get("/encoder", encoder_controller.encoder_get);

/* GET Dictionary page */
router.get("/dictionary", dictionary_controller.dictionary_get);

/* POST Dictionary page */
router.post("/dictionary", dictionary_controller.dictionary_post);

/* GET Delete Glyph page */
router.get("/glyph/:id/delete", dictionary_controller.delete_glyph_get);

/* POST Delete Glyph page */
router.post("/glyph/:id/delete", dictionary_controller.delete_glyph_post);

/* GET Edit Glyph page */
router.get("/glyph/:id/edit", dictionary_controller.edit_glyph_get);

/* POST Edit Glyph page */
router.post("/glyph/:id/edit", dictionary_controller.edit_glyph_post);

module.exports = router;
