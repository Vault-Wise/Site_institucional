var express = require("express");
var router = express.Router();

var agenciaController = require("../controllers/agenciaController");

router.post("/cadastrar", function (req, res) {
    agenciaController.cadastrar(req, res);
})

module.exports = router;