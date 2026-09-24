const { body, validationResult } = require("express-validator");

const { registerGlyph, getGlyphByCode, getGlyphAll } = require("../models/queries.mjs");

/*dictionary GET request*/
exports.dictionary_get = async (req, res, next) => {
  const oldGlyph = getGlyphByCode.get("aaa");
  const allGlyph = getGlyphAll.all();
  console.log(allGlyph)
  let message;
  if (!oldGlyph) {
    message = "...nobody here but us chickens...";
  } else {
    message = allGlyph;
  }

  res.render("dictionary", { text: message });
};

/*dictionary POST request*/
exports.dictionary_post = [
  body("char_code").trim().isLength({ min: 1 }).escape(),
  body("meaning").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const char_code = req.body.char_code;
    //const glyph_id = 1; ////PLACEHOLDER
    const meaning = req.body.meaning;
    const image_link = "placeholder"; ////PLACEHOLDER
    if (errors.isEmpty()) { ///NEED TO IMPLEMENT ERROR RESPONSE PAGE
      const newGlyph = registerGlyph.get(
        //glyph_id,
        char_code,
        image_link,
        meaning,
      );
    }
    res.redirect("dictionary");
  },
];
/*
[
  body("name", "Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("level", "Enter the formula's level")
    .trim()
    .isInt({ min: 1, max: 5 })
    .withMessage("Level must be between 1 and 5"),
  body("ingredients").trim().escape(),
  body("system").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const formula = new Formula({
      name: req.body.name,
      level: req.body.level,
      ingredients: req.body.ingredients,
      system: req.body.system,
    });
    if (!errors.isEmpty()) {
      res.render("formula_form", {
        title: "Edit Formula",
        formula,
        errors: errors.array(),
      });
      return;
    }
    const formulaExists = await Formula.findOne({
      name: req.body.name,
    })
      .collation({ locale: "en", strength: 2 })
      .exec();
    if (formulaExists) {
      res.redirect(formulaExists.url);
      return;
    }
    await formula.save();
    res.redirect(formula.url);
  },
];
*/
