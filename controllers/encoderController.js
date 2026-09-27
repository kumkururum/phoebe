const { body, validationResult } = require("express-validator");
const { getGlyphAll, getGlyphIndex } = require("../models/queries.mjs");

/*encoder GET request*/
exports.encoder_get = async (req, res, next) => {
  const allGlyph = getGlyphIndex.all();
  const script = JSON.stringify(allGlyph.map((item) => item.char_code));
  const dictionary = JSON.stringify(getGlyphAll.all());
  //res.status(200).json(script);
  //next()
  res.render("encoder", { script: script, dictionary: dictionary });
};

/*encoder POST request*/
exports.encoder_post = async (req, res, next) => {
  res.render("encoder");
};
/*

needs to:
-detect changes in the input field,
-parse them into character codes,
-push them into an array,
-feed the array to the template 

*/
