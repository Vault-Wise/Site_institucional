var database = require("../database/config");

function cadastrar(cep, numero, empresa) {

  var instrucaoSql = `INSERT INTO Agencia (cep, numero, fkEmpresa) VALUES ('${cep}', ${numero}, ${empresa})`;

  return database.executar(instrucaoSql, [cep, numero]);
}

function associar(maquina, agencia) {

  var instrucaoSql1 = `SELECT idCaixa FROM caixaeletronico WHERE nomeEquipamento = '${maquina}'`;

  return database.executar(instrucaoSql1).then(resultadoSelect => {
    var idCaixa = resultadoSelect[0].idCaixa;

    var instrucaoSql2 = `UPDATE caixaeletronico SET fkAgencia = ${agencia} WHERE idCaixa = ${idCaixa}`;
    
    return database.executar(instrucaoSql2);
  })
}

function listar() {
  var instrucaoSql = `SELECT idAgencia FROM agencia;`;

  return database.executar(instrucaoSql);
}

function listarMaquina() {
  var instrucaoSql = `SELECT nomeEquipamento FROM caixaeletronico`;

  return database.executar(instrucaoSql);
}

module.exports = {
  cadastrar,
  listar,
  listarMaquina,
  associar
};