var database = require("../database/config");

function capturarPIDs(fkCaixa) {
    var instrucaoSql = `
        SELECT idPID, numeroPID, nivelAmeaca, fkProcesso, fkRegistro, fkCaixa 
        FROM PID
        WHERE fkCaixa = ${fkCaixa};
    `;
    
    return database.executar(instrucaoSql);
}

function capturarRede(fkCaixa) {
    var instrucaoSql = `
        SELECT velocidadeUpload, velocidadeDownload FROM Registro WHERE fkCaixa = ${fkCaixa} ORDER BY dtHora DESC LIMIT 10;
    `;
    
    return database.executar(instrucaoSql);
}

module.exports = {
    capturarPIDs,
    capturarRede
};