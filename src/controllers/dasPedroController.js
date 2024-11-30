var dashPedroModel = require("../models/dashPedroModel");


function selecionarAgencia(req, res) {
  var agencia = req.params.agencia;
  var ano = req.params.ano;
  var mes = req.params.mes;

  dashPedroModel.buscarAgencia(agencia, ano, mes)
      .then(resultado => res.status(200).json(resultado))
      .catch(erro => {
          console.error("Erro ao buscar agência: ", erro);
          res.status(500).json({ erro: "Erro ao buscar dados da agência." });
      });
}



function listar(req, res) {
    dashPedroModel.listar().then((resultadoDoMes) => {
      res.status(200).json(resultadoDoMes);
    });
  }




  function graficoPzza(req, res) {
    var agenciaSelect = req.params.agenciaSelects;

  
    dashPedroModel.graficoPzza(agenciaSelect)
      .then(dados => {
        res.status(200).json({ agenciaSelects: dados }); 
      })
      .catch(erro => {
        console.error("Erro ao realizar o select da dashPedro: ", erro);
        res.status(500).json({ erro: "Erro ao realizar o select da dashPedro." });
      });
  }





  function tabelaCentro(req, res) {
    var tabelaCentro = req.params.tabelaCentro;
  
    dashPedroModel.tabelaCentro(tabelaCentro)
      .then(dados => {
        res.status(200).json({ tabelaCentro: dados }); 
      })
      .catch(erro => {
        console.error("Erro ao realizar o select da dashPedro: ", erro);
        res.status(500).json({ erro: "Erro ao realizar o select da dashPedro." });
      });
  }




  function tabelaCanto(req, res) {
    var tabelaCanto = req.params.tabelaCanto;
  
    dashPedroModel.tabelaCanto(tabelaCanto)
      .then(dados => {
        res.status(200).json({ tabelaCanto: dados }); 
      })
      .catch(erro => {
        console.error("Erro ao realizar o select da dashPedro: ", erro);
        res.status(500).json({ erro: "Erro ao realizar o select da dashPedro." });
      });
  }



  module.exports = {
    selecionarAgencia,
    listar,
    graficoPzza,
    tabelaCentro,
    tabelaCanto
  };
  