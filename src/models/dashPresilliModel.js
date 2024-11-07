var database = require("../database/config");

function capturarInformacoes(dias, fkCaixa) {
    if(dias != "Tempo Real") {
        var instrucaoSql = `
        SELECT * 
        FROM dashPresilli
        WHERE dtHora BETWEEN DATE_SUB(NOW(), INTERVAL ${dias} DAY) AND NOW() AND fkCaixa = ${fkCaixa};
        `;
    
    }

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





module.exports = {
    capturarInformacoes,
    capturarDadosTempoReal
};