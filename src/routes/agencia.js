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

module.exports = router;