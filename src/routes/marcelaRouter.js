var express = require("express");
var router = express.Router();

var dashMarcelaController = require("../controllers/dashMarcelaController");

router.get("/capturarInformacoes", function (req, res) {
    dashMarcelaController.capturarInformacoes(req, res)
});

router.get("/capturarInformacoesGrafico", function (req, res) {
    dashMarcelaController.obterDadosGrafico(req, res)
});

router.get("/capturarInformacoesMaquina", function (req, res) {
    dashMarcelaController.totalMaquinas(req, res)
});

router.get("/alertasUltimoDia", function(req,res){
    dashMarcelaController.alertasUltimaDia(req,res)
})

router.get("/ultimoCritico", function(req,res){
    dashMarcelaController.ultimoCritico(req,res)
})

router.get("/historicoPerigo", function(req,res){
    dashMarcelaController.historicoPerigo(req,res)
})

module.exports = router;