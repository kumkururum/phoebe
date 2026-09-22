const { body, validationResult } = require("express-validator");

/*encoder GET request*/
exports.encoder_get = async (req, res, next) => {
  res.render("encoder");
};
