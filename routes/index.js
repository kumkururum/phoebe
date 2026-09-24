const express = require("express");
const router = express.Router();

const encoder_controller = require("../controllers/encoderController");
const dictionary_controller = require("../controllers/dictionaryController");
const { countGlyphs } = require("../models/queries.mjs");

/* GET home page. */
router.get("/", function (req, res, next) {
  const tally = countGlyphs.get()[`COUNT (glyph_id)`]; //SOMEBODY NEEDS TO FIX THIS AWFUL IMPLEMENTATION, LIKELY ME
  console.log(tally);
  res.render("index", { nglyphs: tally });
});

/* GET Encoder page */
router.get("/encoder", encoder_controller.encoder_get);

/* GET Dictionary page */
router.get("/dictionary", dictionary_controller.dictionary_get);

/* POST Dictionary page */
router.post("/dictionary", dictionary_controller.dictionary_post);

module.exports = router;
