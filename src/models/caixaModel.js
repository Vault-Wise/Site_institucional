  var database = require("../database/config");

  function listarCaixas() {
      var instrucaoSql = `SELECT * FROM CaixaEletronico;`;
    
      return database.executar(instrucaoSql);
    }

    function listarCaixasTabela() {
      var instrucaoSql = `SELECT
    nomeEquipamento,
    MIN(percentMemoria) AS memoriaPercentMinima,
    MAX(percentMemoria) AS memoriaPercentMaxima,
    MIN(percentProcessador) AS processadorPercentMinimo,
    MAX(percentProcessador) AS processadorPercentMaximo
    FROM Registro JOIN CaixaEletronico ON fkCaixa = idCaixa
    GROUP BY nomeEquipamento;`;
    
      return database.executar(instrucaoSql);
    }

  module.exports = {
      listarCaixas,
      listarCaixasTabela
  };
