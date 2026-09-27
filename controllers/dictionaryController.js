const { body, validationResult } = require("express-validator");
const path = require("path"); //needed for naming with multer

//Multer setup
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "user_files/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    req.errorMessage = "Only .png and .jpeg files are accepted.";
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

//Database queries import
const {
  registerGlyph,
  getGlyphByCode,
  getGlyphAll,
} = require("../models/queries.mjs");

/*dictionary GET request*/
exports.dictionary_get = (req, res, next) => {
  //const oldGlyph = getGlyphByCode.get("aaa");
  const allGlyph = getGlyphAll.all();
  console.log(allGlyph);
  let message;
  if (allGlyph.length === 0) {
    message = "...nobody here but us chickens...";
  } else {
    message = allGlyph;
  }

  res.render("dictionary", { text: message });
};
//this needs to be incorporated into real validations
const validateGlyphUpload = (req, res, next) => {
  const { error } = validateGlyph(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return next;
};

/*dictionary POST request*/
exports.dictionary_post = [
  upload.single("new_glyph"),
  body("char_code").trim().isLength({ min: 1 }).escape(),
  body("meaning").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const char_code = req.body.char_code;
    const meaning = req.body.meaning;
    console.log(req.file);
    if (!errors.isEmpty()) {
      return res.render("dictionary", { errors: errors.array() }); //very rudimentary, need better error handling ALSO include Multer specific error
    } else {
      if (!req.file) {
        return res.render("dictionary", {
          errors: [{ msg: "No file detected" }],
        });
      }
      const image_link = `/user_files/${req.file.filename}`;
      const newGlyph = registerGlyph.get(char_code, image_link, meaning);
    }

    return res.redirect("dictionary");
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
