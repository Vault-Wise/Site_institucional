

var dashPedroModel = require("../models/dashPedroModel");

function selecionarAgencia(req, res) {
  var agencia = req.params.agencia;// parâmetro para filtrar por agencia
  var ano = req.params.ano;// parâmetro para filtrar por ano
  var mes = req.params.mes; //  parâmetro para filtrar por mês
  var maquina = req.params.maquina; //  parâmetro para filtrar por máquina

  if (!agencia || !ano || !mes) {
    return res.status(400).json({ erro: "Parâmetros inválidos" });
  }

  dashPedroModel.buscarAgencia(agencia, ano, mes, maquina) // Passando 'maquina' para o model
    .then(resultado => res.status(200).json(resultado))
    .catch(erro => {
      console.error("Erro ao buscar agência: ", erro);
      res.status(500).json({ erro: "Erro ao buscar dados da agência." });
    });
}


function listar(req, res) {
  dashPedroModel.listar()
    .then(resultadoDoMes => res.status(200).json(resultadoDoMes))
    .catch(erro => {
      console.error("Erro ao listar agências e meses: ", erro);
      res.status(500).json({ erro: "Erro ao listar dados." });
    });
}


function graficoPzza(req, res) {
  var agencia = req.params.agencia;
  var mes = req.params.mes;

  if (!agencia || !mes) {
    return res.status(400).json({ erro: "Parâmetros inválidos" });
  }

  dashPedroModel.graficoPzza(agencia, mes)
    .then(dados => {
      res.status(200).json({ agencia, mes, valores: dados });
    })
    .catch(erro => {
      console.error("Erro ao realizar o select da dashPedro: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashPedro." });
    });
}



function alertaMes(req, res) {
  var agencia = req.params.agencia;
  var ano = req.params.ano;
  var mes = req.params.mes;

  if (!agencia || !ano || !mes) {
    return res.status(400).json({ erro: "Parâmetros inválidos" });
  }

  dashPedroModel.alertaMes(agencia, ano, mes)
    .then(dados => res.status(200).json(dados))
    .catch(erro => {
      console.error("Erro ao buscar alertas por mês: ", erro);
      res.status(500).json({ erro: "Erro ao buscar dados." });
    });
}



function tabelaCentro(req, res) {
  var centro = req.params.tabelaCentro;

  if (!centro) {
    return res.status(400).json({ erro: "Parâmetro inválido" });
  }

  dashPedroModel.tabelaCentro(centro)
    .then(dados => res.status(200).json({ centro: dados }))
    .catch(erro => {
      console.error("Erro ao realizar o select da dashPedro: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashPedro." });
    });
}


function tabelaCanto(req, res) {
  var tabelaCanto = req.params.tabelaCanto;

  if (!tabelaCanto) {
    return res.status(400).json({ erro: "Parâmetro inválido" });
  }

  dashPedroModel.tabelaCanto(tabelaCanto)
    .then(dados => res.status(200).json({ tabelaCanto: dados }))
    .catch(erro => {
      console.error("Erro ao realizar o select da dashPedro: ", erro);
      res.status(500).json({ erro: "Erro ao realizar o select da dashPedro." });
    });
}


function alertaMes(req, res) {
  var agencia = req.params.agencia;
  var ano = req.params.ano;
  var mes = req.params.mes;

  if (!agencia || !ano || !mes) {
    return res.status(400).json({ erro: "Parâmetros inválidos" });
  }

  dashPedroModel.alertaMes(agencia, ano, mes)
    .then(dados => res.status(200).json(dados))
    .catch(erro => {
      console.error("Erro ao buscar alertas por mês: ", erro);
      res.status(500).json({ erro: "Erro ao buscar dados." });
    });
}





module.exports = {
  selecionarAgencia,
  listar,
  graficoPzza,
  tabelaCentro,
  tabelaCanto,
  alertaMes
};
