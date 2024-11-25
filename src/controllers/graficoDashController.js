var graficosDashModel = require("../models/graficoDashModel");

function mostrarDados(req, res) {
    const caixaId = req.query.caixaId;
    graficosDashModel.mostrarDados(caixaId)
        .then((resultado) => {
            res.status(200).json(resultado);
        });
}

function obterDowntime(req, res) {
    const caixaId = req.query.caixaId;
    graficosDashModel.obterDowntime(caixaId)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
}

function obterAltoUsoContinuo(req, res) {
    const limiteUso = parseFloat(req.query.limiteUso || 80);
    const tempoMinutos = parseInt(req.query.tempoMinutos || 10);

    graficosDashModel
        .obterAltoUsoContinuo(limiteUso, tempoMinutos)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
}


module.exports = {
    mostrarDados,
    obterDowntime,
    obterAltoUsoContinuo
}