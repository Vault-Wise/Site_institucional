var caixaModel = require("../models/caixaModel");

function listarCaixas(req, res) {
    caixaModel.listarCaixas().then((resultado) => {
      res.status(200).json(resultado);
    });
  }

module.exports = {
    listarCaixas
};
