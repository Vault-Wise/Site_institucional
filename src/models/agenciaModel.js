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

function buscarAgencia() {
  var instrucaoSql = `SELECT fkAgencia, count(idAlerta) AS totalAlertas FROM alerta JOIN caixaeletronico ON idCaixa = fkCaixa GROUP BY fkAgencia ORDER BY totalAlertas DESC`;

  return database.executar(instrucaoSql);
}

function alertaHorario(agencia) {
  
  var instrucaoSql = `SELECT count(idAlerta), fkAgencia,
	  SUM(CASE WHEN TIME(dtHora) BETWEEN '09:00:00' AND '12:00:00' THEN 1 ELSE 0 END) AS manha,
    SUM(CASE WHEN TIME(dtHora) BETWEEN '12:00:01' AND '18:00:00' THEN 1 ELSE 0 END) AS tarde,
    SUM(CASE WHEN TIME(dtHora) BETWEEN '18:00:01' AND '23:59:59' THEN 1 ELSE 0 END) AS noite 
		  FROM alerta JOIN registro ON fkRegistro = idRegistro JOIN caixaEletronico ON alerta.fkCaixa = idCaixa WHERE fkAgencia = ${agencia} GROUP BY fkAgencia`;

  return database.executar(instrucaoSql);
}

function agenciaSelecionadaAtual(maquina, agencia) {

  var instrucaoSql = `SELECT fkAgencia, count(idAlerta) AS totalAlertas FROM alerta JOIN caixaeletronico ON idCaixa = fkCaixa GROUP BY fkAgencia ORDER BY totalAlertas DESC LIMIT 1`;

  return database.executar(instrucaoSql);
}



module.exports = {
  cadastrar,
  listar,
  listarMaquina,
  associar,
  buscarAgencia,
  alertaHorario,
  agenciaSelecionadaAtual
};