var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function (req, res) {
  empresaController.cadastrar(req, res);
});

router.get("/buscarCodigo/:idEmpresa", function (req, res) {
  empresaController.buscarCodigo(req, res);
});

router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

router.get("/capturarDados", function (req, res) {
  empresaController.capturarDados(req, res);
});

module.exports = router;