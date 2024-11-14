var express = require("express");
var router = express.Router();
var caixaController = require("../controllers/caixaController");

router.get("/listarCaixas", function (req, res) {
    caixaController.listarCaixas(req, res);
  });

  router.get("/listarCaixasTabela", function (req, res) {
    caixaController.listarCaixasTabela(req, res);
  });

module.exports = router;
