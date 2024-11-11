var express = require("express");
var router = express.Router();
var caixaController = require("../controllers/caixaController");

router.get("/listarCaixas", caixaController.listarCaixas);

module.exports = router;
