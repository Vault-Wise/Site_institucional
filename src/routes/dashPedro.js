
var express = require("express");
var router = express.Router();

var dashPedroController = require("../controllers/dashPedroController");

router.get("/capturarInformacoes/:intervalo/:fkCaixa", function (req, res) {
    dashPedroController.capturarInformacoes(req, res)
});

router.get("/capturarDadosTempoReal/:fkCaixa", function (req, res) {
    dashPedroController.capturarDadosTempoReal(req, res)
});

router.get("/capturarMaquinas/:idAgencia", function (req, res) {
    dashPedroController.capturarMaquinas(req, res)
});

module.exports = router;
