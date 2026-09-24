const { body, validationResult } = require("express-validator");

/*encoder GET request*/
exports.encoder_get = async (req, res, next) => {
  res.render("encoder");
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
