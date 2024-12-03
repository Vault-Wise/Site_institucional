

var express = require("express");
var router = express.Router();

var dasPedroController = require("../controllers/dasPedroController");



// Lista agências, meses e máquinas
router.get("/listar", function (req, res) {
    dasPedroController.listar(req, res);
});



// Busca os dados de uma agência específica, para um ano, mês e máquina específicos
router.get("/buscarAgencia/:agencia/:ano/:mes/:maquina?", function (req, res) {
    dasPedroController.selecionarAgencia(req, res);
});



// Gráfico com base na agência e mês selecionados
router.get("/graficoPzza/:agencia/:mes", function (req, res) {
    dasPedroController.graficoPzza(req, res);
});



// Endpoints para outras tabelas (centro e canto)
router.get("/tabelaCentro/:tabelaCentro", function (req, res) {
    dasPedroController.tabelaCentro(req, res);
});



router.get("/tabelaCanto/:tabelaCanto", function (req, res) {
    dasPedroController.tabelaCanto(req, res);
  });
  


  
  // Exportando as rotas
  module.exports = router;
