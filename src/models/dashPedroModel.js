

var database = require("../database/config");

function listar() {
  var instrucaoSql1 = `SELECT idAgencia AS agencia FROM Agencia`;
  var instrucaoSql2 = `SELECT DISTINCT YEAR(dtHora) AS anoAtual FROM Registro`;
  var instrucaoSql3 = `SELECT DISTINCT nomeMaquina AS maquina FROM Maquina`; // Nova instrução SQL para buscar máquinas

  return Promise.all([database.executar(instrucaoSql1), database.executar(instrucaoSql2), database.executar(instrucaoSql3)])
    .then(([resultadoAgencias, resultadoMes, resultadoMaquinas]) => {
      return {
        agencias: resultadoAgencias.map(row => row.agencia),
        meses: resultadoMes.map(row => row.anoAtual),
        maquinas: resultadoMaquinas.map(row => row.maquina) // Retornando lista de máquinas
      };
    });
}


function buscarAgencia(agencia, ano, mes, maquina) {
  var instrucaoSql = `
  SELECT fkAgencia, COUNT(idAlerta) AS totalAlertas, cep, numero 
  FROM Alerta 
  JOIN CaixaEletronico ON idCaixa = fkCaixa
  WHERE fkAgencia = ? AND YEAR(dtHora) = ? AND MONTH(dtHora) = ?
  ${maquina ? 'AND fkMaquina = ?' : ''}
  GROUP BY fkAgencia 
  ORDER BY totalAlertas DESC;
  `;
  
  if (maquina) {
    return database.executar(instrucaoSql, [agencia, ano, mes, maquina]); // Passando a máquina para o filtro
  } else {
    return database.executar(instrucaoSql, [agencia, ano, mes]); // Caso a máquina não seja fornecida
  }
}


function graficoPzza(agencia, mes) {
  var instrucaoSql = `
  SELECT algo FROM Tabela 
  WHERE fkAgencia = ? AND MONTH(dtHora) = ?;
  `;

  return database.executar(instrucaoSql, [agencia, mes]);
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
  graficoPzza,
  alertaMes
};





