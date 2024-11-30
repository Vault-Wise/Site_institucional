
var express = require("express");
var router = express.Router();

var dasPedroController = require("../controllers/dasPedroController");

router.get("/listar", function (req, res) {
    dasPedroController.listar(req, res);
})


router.get("/buscarAgencia/:agencias/:anos", function (req, res) {
    dasPedroController.buscarAgencia(req, res);
})

router.get("/alertaMes", function (req, res) {
    dasPedroController.alertaMes(req, res);
})

module.exports = router;
