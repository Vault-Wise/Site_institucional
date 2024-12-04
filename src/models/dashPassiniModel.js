var database = require("../database/config");

function capturarPIDs(fkCaixa) {
    var instrucaoSql = `
       SELECT 
    PID.idPID, 
    PID.numeroPID, 
    PID.nivelAmeaca, 
    PID.fkProcesso, 
    PID.fkRegistro, 
    PID.fkCaixa,
    Processo.nome AS nomeProcesso
FROM 
    PID
JOIN 
    Processo 
    ON 
        PID.fkProcesso = Processo.idProcesso 
        AND PID.fkRegistro = Processo.fkRegistro 
        AND PID.fkCaixa = Processo.fkCaixa
JOIN 
    Registro 
    ON 
        PID.fkRegistro = Registro.idRegistro
WHERE 
    PID.fkCaixa = ${fkCaixa}
    AND Registro.dtHora >= NOW() - INTERVAL 1 MINUTE
ORDER BY 
    PID.nivelAmeaca DESC;
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
    capturarRede,

};