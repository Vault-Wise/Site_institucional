var express = require("express");
var router = express.Router();

var dashPresilliController = require("../controllers/dashPresilliController");

router.get("/capturarInformacoes/:intervalo/:fkCaixa", function (req, res) {
    dashPresilliController.capturarInformacoes(req, res)
})

module.exports = router;