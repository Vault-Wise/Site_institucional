var database = require("../database/config");

function capturarPIDs(fkCaixa) {
    var instrucaoSql = `
        SELECT idPID, numeroPID, nivelAmeaca, fkProcesso, fkRegistro, fkCaixa 
        FROM PID
        WHERE fkCaixa = ${fkCaixa};
    `;
    
    return database.executar(instrucaoSql);
}

module.exports = {
    capturarPIDs
};
module.exports = {
    capturarPIDs
};
