var dashPassiniModel = require("../models/dashPassiniModel");

function capturarPIDs(req, res) {
    var fkCaixa = req.params.fkCaixa

    dashPassiniModel.capturarPIDs(fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}


module.exports = {
    capturarPIDs
};