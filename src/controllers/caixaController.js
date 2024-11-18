var caixaModel = require("../models/caixaModel");

function listarCaixas(req, res) {
    caixaModel.listarCaixas().then((resultado) => {
      res.status(200).json(resultado);
    });
  }

function listarCaixasTabela(req, res) {
    caixaModel.listarCaixasTabela().then((resultado) => {
      res.status(200).json(resultado);
    });
  }
  

module.exports = {
    listarCaixas,
    listarCaixasTabela
};
