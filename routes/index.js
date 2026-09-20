const express = require("express");
const router = express.Router();

const encoder_controller = require("../controllers/encoderController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Phoebe" });
});

/* GET Encoder page */
router.get("/phoebe", encoder_controller.encoder_get);

module.exports = router;
