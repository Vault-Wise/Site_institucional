var agenciaModel = require("../models/agenciaModel");

function cadastrar(req, res) {
  var numero = req.body.numeroServer;
  var cep = req.body.cepServer;
  var empresa = req.body.empresaServer;


  agenciaModel.cadastrar(cep, numero, empresa)
      .then(() => {
          res.status(201).json({ mensagem: "Agencia cadastrada com sucesso!" });
      })
      .catch(erro => {
          console.error("Erro ao cadastrar a agencia: ", erro);
          res.status(500).json({ erro: "Erro ao cadastrar a agencia." });
      });
}

function listar(req, res) {
  agenciaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

module.exports = {
  cadastrar,
  listar
};
