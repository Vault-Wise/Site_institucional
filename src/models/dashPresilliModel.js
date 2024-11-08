var database = require("../database/config");

function capturarInformacoes(dias, fkCaixa) {
    var instrucaoSql = `
        SELECT DAY(dtHora) AS dia, AVG(percentProcessador) AS mediaProcessador, AVG(percentMemoria) AS mediaMemoria
	    FROM dashPresilli WHERE dtHora BETWEEN DATE_SUB(NOW(), INTERVAL ${dias} DAY) AND NOW() AND fkCaixa = ${fkCaixa} 
		GROUP BY DAY(dtHora);`;

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