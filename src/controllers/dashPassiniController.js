var dashPassiniModel = require("../models/dashPassiniModel");

function capturarPIDs(req, res) {
    var fkCaixa = req.params.fkCaixa

    dashPassiniModel.capturarPIDs(fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function capturarRede(req, res) {
    var fkCaixa = req.params.fkCaixa

    dashPassiniModel.capturarRede(fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}


module.exports = {
    capturarPIDs,
    capturarRede
};