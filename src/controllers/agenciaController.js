var agenciaModel = require("../models/agenciaModel");

function cadastrar(req, res) {
  var numero = req.body.numeroServer;
  var cep = req.body.cepServer;


  agenciaModel.cadastrar(cep, numero)
      .then(() => {
          res.status(201).json({ mensagem: "Agencia cadastrada com sucesso!" });
      })
      .catch(erro => {
          console.error("Erro ao cadastrar a agencia: ", erro);
          res.status(500).json({ erro: "Erro ao cadastrar a agencia." });
      });
}

module.exports = {
  cadastrar
};
