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

function associar(req, res) {
  var maquina = req.body.maquinaServer;
  var agencia = req.body.agenciaServer;

  agenciaModel.associar(maquina, agencia)
    .then(() => {
      res.status(201).json({ mensagem: "Máquina associada com sucesso!" });
    })
    .catch(erro => {
      console.error("Erro ao associar máquina: ", erro);
      res.status(500).json({ erro: "Erro ao associar máquina." });
    });
}

function listar(req, res) {
  agenciaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listarMaquina(req, res) {
  agenciaModel.listarMaquina().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarAgencia(req, res) {
  var agencia = req.params.agencias;
  var ano = req.params.anos;

  agenciaModel.buscarAgencia(agencia, ano).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function selectsDaPagina(req, res) {
  agenciaModel.buscarAgencia().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function alertaHorario(req, res) {

  var agencia = req.params.agencias;
  var ano = req.params.anos;

  agenciaModel.alertaHorario(agencia, ano).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function agenciaSelecionadaAtual(req, res) {
  var componente = req.body.componenteServer;
  var agencia = req.body.agenciaServer;

  agenciaModel.agenciaSelecionadaAtual(componente, agencia)
    .then(() => {
      res.status(201).json({ mensagem: "Select funcionou" });
    })
    .catch(erro => {
      console.error("Erro ao realizar o select da dashNicolas: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashNicolas." });
    });
}

function dadosGrafico(req, res) {
  var agencia = req.params.agencias;
  

  agenciaModel.dadosGrafico(agencia)
    .then(dados => {
      res.status(200).json({ agencias: dados }); 
    })
    .catch(erro => {
      console.error("Erro ao realizar o select da dashNicolas: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashNicolas." });
    });
}

function dadosGrafico2(req, res) {
  var agencia2 = req.params.agencias2;

  agenciaModel.dadosGrafico2(agencia2)
    .then(dados => {
      res.status(200).json({ agencias: dados }); 
    })
    .catch(erro => {
      console.error("Erro ao realizar o select da dashNicolas: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashNicolas." });
    });
}

function dadosGrafico3(req, res) {
  var agencia3 = req.params.agencias3;

  agenciaModel.dadosGrafico3(agencia3)
    .then(dados => {
      res.status(200).json({ agencias: dados }); 
    })
    .catch(erro => {
      console.error("Erro ao realizar o select da dashNicolas: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashNicolas." });
    });
}

module.exports = {
  cadastrar,
  listar,
  listarMaquina,
  associar,
  buscarAgencia,
  alertaHorario,
  agenciaSelecionadaAtual,
  dadosGrafico,
  dadosGrafico2,
  dadosGrafico3
};
