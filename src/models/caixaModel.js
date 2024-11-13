  var database = require("../database/config");

  function listarCaixas() {
      var instrucaoSql = `SELECT * FROM CaixaEletronico`;
    
      return database.executar(instrucaoSql);
    }

  module.exports = {
      listarCaixas
  };
