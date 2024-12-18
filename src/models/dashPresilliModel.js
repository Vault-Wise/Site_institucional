var database = require("../database/config");

function capturarInformacoes(horas, fkCaixa) {
    var instrucaoSql = `
        SELECT DATE(dtHora) as dia, HOUR(dtHora) AS hora, ROUND(AVG(percentCPU), 2) AS mediaCPU, ROUND(AVG(percentMemoria), 2) AS mediaMemoria
	    FROM dashPresilli WHERE dtHora BETWEEN DATE_SUB(NOW(), INTERVAL ${horas} HOUR) AND NOW() AND fkCaixa = ${fkCaixa}
		GROUP BY hora, dia 
        ORDER BY dia ASC, hora ASC;`;

    return database.executar(instrucaoSql);
}

function capturarDadosTempoReal(fkCaixa) {
    var instrucaoSql = `
    SELECT * 
    FROM dashPresilli
    WHERE fkCaixa = ${fkCaixa} ORDER BY dtHora DESC LIMIT 10;
    `;

    return database.executar(instrucaoSql);
}

function capturarMaquinas() {
    var instrucaoSql = `
    SELECT * FROM CaixaEletronico;
    `;

    return database.executar(instrucaoSql);
}

function capturaProcessosTempoReal(fkCaixa) {
    var instrucaoSql = `
    SELECT *,
       (percentProcessador + percentMemoria) AS totalPercentual
    FROM Processo
    WHERE dtHora >= (
        SELECT MAX(dtHora) - INTERVAL 30 SECOND 
        FROM Processo
    )
    AND fkCaixa = ${fkCaixa}
    ORDER BY totalPercentual DESC
    LIMIT 3;
   `;

    return database.executar(instrucaoSql);
}

function capturaProcessosIntervalo(fkCaixa, intervalo) {
    var instrucaoSql = `
    SELECT nome, percentMemoria, percentProcessador, dtHora,
        (percentProcessador + percentMemoria) AS totalPercentual 
    FROM Processo
    WHERE dtHora >= (
        SELECT MAX(dtHora) - INTERVAL ${intervalo} HOUR
        FROM Processo
        WHERE fkCaixa = ${fkCaixa}
    )
    AND fkCaixa = ${fkCaixa}
    ORDER BY totalPercentual DESC
    LIMIT 3;
   `;

    return database.executar(instrucaoSql);
}

function capturarChave() {
    var instrucaoSql = `
    SELECT * FROM ChaveGemini;
   `;

    return database.executar(instrucaoSql);
}

module.exports = {
    capturarInformacoes,
    capturarDadosTempoReal,
    capturarMaquinas,
    capturaProcessosTempoReal,
    capturaProcessosIntervalo,
    capturarChave
};