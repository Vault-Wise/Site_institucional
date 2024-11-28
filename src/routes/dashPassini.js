var express = require("express");
var router = express.Router();

var dashPassiniController = require("../controllers/dashPassiniController");

router.get("/capturaPIDs/:fkCaixa", function (req, res) {
    console.log("router passini acess")
    dashPassiniController.capturarPIDs(req, res)
});

module.exports = router;