var dashPresilliModel = require("../models/dashPresilliModel");

function capturarInformacoes(req, res) {
    var intervaloDias = req.params.intervalo;
    var fkCaixa = req.params.fkCaixa

    dashPresilliModel.capturarInformacoes(intervaloDias, fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    capturarInformacoes
};