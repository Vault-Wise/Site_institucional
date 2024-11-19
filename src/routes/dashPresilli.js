var express = require("express");
var router = express.Router();

var dashPresilliController = require("../controllers/dashPresilliController");

router.get("/capturarInformacoes/:intervalo/:fkCaixa", function (req, res) {
    dashPresilliController.capturarInformacoes(req, res)
});

router.get("/capturarDadosTempoReal/:fkCaixa", function (req, res) {
    dashPresilliController.capturarDadosTempoReal(req, res)
});

router.get("/capturarMaquinas/:idAgencia", function (req, res) {
    dashPresilliController.capturarMaquinas(req, res)
});

router.get("/capturaProcessosTempoReal/:fkCaixa", function (req, res) {
    dashPresilliController.capturaProcessosTempoReal(req, res)
});

router.get("/capturaProcessosIntervalo/:intervalo/:fkCaixa", function (req, res) {
    dashPresilliController.capturaProcessosIntervalo(req, res)
});


module.exports = router;