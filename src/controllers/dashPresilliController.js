var dashPresilliModel = require("../models/dashPresilliModel");

function capturarInformacoes(req, res) {
    var intervaloHoras = req.params.intervalo;
    var fkCaixa = req.params.fkCaixa

    dashPresilliModel.capturarInformacoes(intervaloHoras, fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function capturarDadosTempoReal(req, res) {
    var fkCaixa = req.params.fkCaixa

    dashPresilliModel.capturarDadosTempoReal(fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function capturarMaquinas(req, res) {
    dashPresilliModel.capturarMaquinas().then((resultado) => {
        res.status(200).json(resultado);
    });
}

function capturaProcessosTempoReal(req, res) {
    var fkCaixa = req.params.fkCaixa

    dashPresilliModel.capturaProcessosTempoReal(fkCaixa).then((resultado) => {
        res.status(200).json(resultado);
    });
}

function capturaProcessosIntervalo(req, res) {
    var fkCaixa = req.params.fkCaixa
    var intervalo = req.params.intervalo

    dashPresilliModel.capturaProcessosIntervalo(fkCaixa, intervalo).then((resultado) => {
        res.status(200).json(resultado)
    });
}

function capturarChave(req, res) {
    dashPresilliModel.capturarChave().then((resultado) => {
        res.status(200).json(resultado)
    });
}

module.exports = {
    capturarInformacoes,
    capturarDadosTempoReal,
    capturarMaquinas,
    capturaProcessosTempoReal,
    capturaProcessosIntervalo,
    capturarChave
};