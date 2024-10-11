var express = require("express");
var router = express.Router();

var graficosDashController = require("../controllers/graficoDashController");

router.get("/mostrarDados", function (req, res) {
  graficosDashController.mostrarDados(req, res);
});

module.exports = router