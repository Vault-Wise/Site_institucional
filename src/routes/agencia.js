var express = require("express");
var router = express.Router();

var agenciaController = require("../controllers/agenciaController");

router.post("/cadastrar", function (req, res) {
    agenciaController.cadastrar(req, res);
})

router.post("/associar", function (req, res) {
    agenciaController.associar(req, res);
})

router.get("/listar", function (req, res) {
    agenciaController.listar(req, res);
})

router.get("/listarMaquina", function (req, res) {
    agenciaController.listarMaquina(req, res);
})

router.get("/buscarAgencia/:agencias/:anos", function (req, res) {
    agenciaController.buscarAgencia(req, res);
})

router.get("/alertaHorario/:agencias/:anos", function (req, res) {
    agenciaController.alertaHorario(req, res);
})

router.get("/agenciaSelecionadaAtual", function (req, res) {
    agenciaController.agenciaSelecionadaAtual(req, res);
})

router.get("/dados/:agencias", function (req, res) {
    agenciaController.dadosGrafico(req, res);
})

router.get("/dados/:agencias2", function (req, res) {
    agenciaController.dadosGrafico2(req, res);
})

module.exports = router;