var express = require("express");
var router = express.Router();

var quizController = require("../controllers/chartsController");

router.post("/inserir_dados", function(req, res) {
    quizController.inserir_pontuacao(req, res)
})
module.exports = router