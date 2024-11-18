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

function capturarMaquinas(fkAgencia) {
    var instrucaoSql = `
    SELECT * 
    FROM CaixaEletronico WHERE fkAgencia = ${fkAgencia};
    `;

    return database.executar(instrucaoSql);
}


module.exports = {
    capturarInformacoes,
    capturarDadosTempoReal,
    capturarMaquinas
};