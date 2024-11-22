var database = require("../database/config");

function cadastrar(cep, numero, empresa) {

  var instrucaoSql = `INSERT INTO Agencia (cep, numero, fkEmpresa) VALUES ('${cep}', ${numero}, ${empresa})`;

  return database.executar(instrucaoSql, [cep, numero]);
}

function associar(maquina, agencia) {

  var instrucaoSql1 = `SELECT idCaixa FROM CaixaEletronico WHERE nomeEquipamento = '${maquina}'`;

  return database.executar(instrucaoSql1).then(resultadoSelect => {
    var idCaixa = resultadoSelect[0].idCaixa;

    var instrucaoSql2 = `UPDATE CaixaEletronico SET fkAgencia = ${agencia} WHERE idCaixa = ${idCaixa}`;

    return database.executar(instrucaoSql2);
  })
}

function listar() {
  var instrucaoSql1 = `SELECT idAgencia FROM Agencia`;
  var instrucaoSql2 = `SELECT DISTINCT YEAR(dtHora) AS anoAtual FROM registro`;

  return Promise.all([database.executar(instrucaoSql1), database.executar(instrucaoSql2)])
    .then(([resultadoAgencias, resultadoAnos]) => {
      return {
        agencias: resultadoAgencias,
        anos: resultadoAnos
      };
    });
}

function listarMaquina() {
  var instrucaoSql = `SELECT nomeEquipamento FROM CaixaEletronico`;

  return database.executar(instrucaoSql);
}

function buscarAgencia(agencia, ano) {
  var instrucaoSql = `
  SELECT fkAgencia, count(idAlerta) AS totalAlertas, cep, numero FROM Alerta 
		JOIN CaixaEletronico ON idCaixa = fkCaixa
		JOIN Registro ON fkRegistro = idRegistro
		JOIN Agencia on fkAgencia = idAgencia
		WHERE YEAR(dtHora) = ${ano}
		GROUP BY fkAgencia ORDER BY totalAlertas DESC;
  `;

  return database.executar(instrucaoSql);
}

function alertaHorario(agencia, ano) {

  var instrucaoSql = `SELECT count(idAlerta), fkAgencia,
	  SUM(CASE WHEN TIME(dtHora) BETWEEN '09:00:00' AND '12:00:00' THEN 1 ELSE 0 END) AS manha,
    SUM(CASE WHEN TIME(dtHora) BETWEEN '12:00:01' AND '18:00:00' THEN 1 ELSE 0 END) AS tarde,
    SUM(CASE WHEN TIME(dtHora) BETWEEN '18:00:01' AND '23:59:59' THEN 1 ELSE 0 END) AS noite 
		  FROM Alerta JOIN Registro ON fkRegistro = idRegistro JOIN CaixaEletronico ON alerta.fkCaixa = idCaixa WHERE fkAgencia = ${agencia} AND YEAR(dtHora) = ${ano} GROUP BY fkAgencia`;

  return database.executar(instrucaoSql);
}

function agenciaSelecionadaAtual(maquina, agencia) {

  var instrucaoSql = `SELECT fkAgencia, count(idAlerta) AS totalAlertas FROM Alerta JOIN CaixaEletronico ON idCaixa = fkCaixa GROUP BY fkAgencia ORDER BY totalAlertas DESC LIMIT 1`;

  return database.executar(instrucaoSql);
}

function dadosGrafico(agencia) {

  var instrucaoSql = `SELECT ROUND(AVG(percentMemoria), 2) AS MediaRAM, 
    ROUND(AVG(percentProcessador), 2) AS MediaCPU,
    DATE_FORMAT(dtHora, '%Y-%m') AS AnoMes,
    YEAR(dtHora) AS ano
      FROM Registro
      JOIN CaixaEletronico on fkCaixa = idCaixa
      WHERE fkAgencia = ${agencia}
      GROUP BY AnoMes, fkAgencia, ano
      ORDER BY AnoMes`;

  return database.executar(instrucaoSql);
}

function dadosGrafico2(agencia2) {

  var instrucaoSql = `SELECT ROUND(AVG(percentMemoria), 2) AS MediaRAM, 
    ROUND(AVG(percentProcessador), 2) AS MediaCPU,
    DATE_FORMAT(dtHora, '%Y-%m') AS AnoMes,
    YEAR(dtHora) AS ano
      FROM Registro
      JOIN CaixaEletronico on fkCaixa = idCaixa
      WHERE fkAgencia = ${agencia2}
      GROUP BY AnoMes, fkAgencia, ano
      ORDER BY AnoMes`;

  return database.executar(instrucaoSql);
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
  dadosGrafico2
};