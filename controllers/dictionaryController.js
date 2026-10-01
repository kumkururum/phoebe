const { body, validationResult } = require("express-validator");
const path = require("path"); //needed for naming with multer
const { unlink } = require("node:fs/promises"); // promise based file system API, to delete pictures

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
  deleteGlyph,
  getGlyphById,
  getGlyphAll,
  updateGlyph,
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

//i think this still occasionally uploads the same file twice
/*dictionary POST request*/
exports.dictionary_post = [
  upload.single("new_glyph"),
  body("char_code").trim().isLength({ min: 1 }).escape(),
  body("meaning").trim().escape(),
  async (req, res, next) => {
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

/*dictionary Delete GET request*/
exports.delete_glyph_get = async (req, res, next) => {
  const glyphId = req.params.id;
  const glyph = getGlyphById.get(glyphId);
  res.render("delete_confirmation", { glyph: glyph });
};

/*dictionary Delete POST request*/
exports.delete_glyph_post = async (req, res, next) => {
  const glyphId = req.body.glyph_id;
  const glyphLink = path.join(__dirname, "..", req.body.image_link);
  try {
    await unlink(glyphLink);
    console.log(`successfully deleted ${glyphLink}`);
    deleteGlyph.get(glyphId);
  } catch (error) {
    console.error("there was an error:", error.message);
    return;
  }

  res.redirect("/dictionary"); // initial slash is needed to not be sent to /glyph/id/dictionary
};

// when deleting a record with broken link, page freezes, because it's waiting to delete a file that it cannot find
// maybe editing records shold be setup such that this wouldn't happen

/*dictionary Edit GET request*/
exports.edit_glyph_get = async (req, res, next) => {
  const glyphId = req.params.id;
  const glyph = getGlyphById.get(glyphId);
  res.render("edit_glyph", { glyph: glyph });
};

/*dictionary Edit POST request*/
exports.edit_glyph_post = [
  upload.single("new_glyph"),
  body("char_code").trim().isLength({ min: 1 }).escape(),
  body("meaning").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const oldLink = req.body.image_link;
    console.log("Old link:" + oldLink);
    const glyphId = req.params.id;
    console.log("ID is" + glyphId);
    //console.log("Filename" + req.file.filename);
    const meaning = req.body.meaning;
    const char_code = req.body.char_code;
    let glyph = {
      image_link: oldLink,
      meaning: meaning,
      char_code: char_code,
      glyph_id: glyphId,
    };
    if (!errors.isEmpty()) {
      res.render("edit_glyph", { glyph: glyph, errors: errors.array() });
      return;
    }
    let image_link;
    if (req.file) {
      console.log(req.file.filename);
      const newLink = `/user_files/${req.file.filename}`;
      console.log("New link is" + newLink);
      try {
        await unlink(path.join(__dirname, "..", oldLink));
        console.log(`successfully deleted ${oldLink}`);
        image_link = newLink;
      } catch (error) {
        console.error("there was an error:", error.message);
        res.render("edit_glyph", { glyph: glyph, errors: error.message });
        return;
      }
    } else {
      image_link = oldLink;
    }
    console.log("ID is" + glyphId);
    console.log("Link is" + image_link);
    const updatedGlyph = updateGlyph.get(
      char_code,
      image_link,
      meaning,
      glyphId,
    );
    res.render("edit_glyph", { glyph: updatedGlyph }); //url must be string; status must be umber w/ "redirect"; with "render" works fine
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
