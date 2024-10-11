var database = require("../database/config");

function cadastrar(cep, numero) {
  

  var instrucaoSql = `INSERT INTO Agencia (default, cep, numero) VALUES ('${cep}', ${numero})`;

  return database.executar(instrucaoSql, [cep, numero]);
}



module.exports = {
  cadastrar,
};