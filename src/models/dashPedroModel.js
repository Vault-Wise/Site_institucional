var database = require("../database/config");

function listar() {
  var instrucaoSql1 = `SELECT idAgencia FROM Agencia`;
  var instrucaoSql2 = `SELECT DISTINCT YEAR(dtHora) AS anoAtual FROM Registro`;

  return Promise.all([database.executar(instrucaoSql1), database.executar(instrucaoSql2)])
    .then(([resultadoAgencias, resultadoMes]) => {
      return {
        agencias: resultadoAgencias,
        mes: resultadoMes
      };
    });
}


function buscarAgencia(agencia, ano, mes) {
  var instrucaoSql = `
  SELECT fkAgencia, COUNT(idAlerta) AS totalAlertas, cep, numero 
  FROM Alerta 
  JOIN CaixaEletronico ON idCaixa = fkCaixa
  WHERE fkAgencia = ? AND YEAR(dtHora) = ? AND MONTH(dtHora) = ?
  GROUP BY fkAgencia 
  ORDER BY totalAlertas DESC;
  `;
  return database.executar(instrucaoSql, [agencia, ano, mes]);
}

function alertaMes(agencia, ano, mes) {
  var instrucaoSql = `
  SELECT COUNT(idAlerta) AS totalAlertas, fkAgencia,
      SUM(CASE WHEN TIME(dtHora) BETWEEN '09:00:00' AND '12:00:00' THEN 1 ELSE 0 END) AS manha,
      SUM(CASE WHEN TIME(dtHora) BETWEEN '12:00:01' AND '18:00:00' THEN 1 ELSE 0 END) AS tarde,
      SUM(CASE WHEN TIME(dtHora) BETWEEN '18:00:01' AND '23:59:59' THEN 1 ELSE 0 END) AS noite 
  FROM Alerta 
  JOIN CaixaEletronico ON fkCaixa = idCaixa 
  WHERE fkAgencia = ? AND YEAR(dtHora) = ? AND MONTH(dtHora) = ? 
  GROUP BY fkAgencia;
  `;
  return database.executar(instrucaoSql, [agencia, ano, mes]);
}


module.exports = {
  listar,
  buscarAgencia,
  alertaMes
};