var database = require("../database/config");

function cadastrar(cep, numero, empresa) {
  

  var instrucaoSql = `INSERT INTO Agencia (cep, numero, fkEmpresa) VALUES ('${cep}', ${numero}, ${empresa})`;

  return database.executar(instrucaoSql, [cep, numero]);
}

function listar() {
  var instrucaoSql = `SELECT idAgencia FROM agencia;`;

  return database.executar(instrucaoSql);
}


module.exports = {
  cadastrar,
  listar
};