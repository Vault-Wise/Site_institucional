var express = require("express");
var router = express.Router();

var chartsController = require("../controllers/chartsController");

router.post("/mostrar_dados", function (req, res) {
    chartsController.cadastrar(req, res);
  });
module.exports = router