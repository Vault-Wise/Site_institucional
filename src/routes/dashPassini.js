var express = require("express");
var router = express.Router();

var dashPassiniController = require("../controllers/dashPassiniController");

router.get("/capturarPIDs/:fkCaixa", function (req, res) {
    dashPassiniController.capturarPIDs(req, res)
});

router.get("/capturarRede/:fkCaixa", function (req, res) {
    dashPassiniController.capturarRede(req, res)
});

module.exports = router;