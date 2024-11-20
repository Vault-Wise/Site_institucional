var database = require("../database/config");

function mostrarDados(caixaId) {
    var instrucaoSql = `
        SELECT 
            dtHora, 
            percentMemoria, 
            percentProcessador, 
            velocidadeUpload, 
            velocidadeDownload 
        FROM Registro 
        WHERE fkCaixa = ${caixaId} 
        ORDER BY dtHora DESC 
        LIMIT 15
    `;
    return database.executar(instrucaoSql);
}

function obterDowntime(caixaId) {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(r1.dtHora, '%Y-%m-%d %H:%i:%s') AS inicio,
            DATE_FORMAT(r2.dtHora, '%Y-%m-%d %H:%i:%s') AS fim,
            TIMESTAMPDIFF(MINUTE, r1.dtHora, r2.dtHora) AS downtime
        FROM Registro r1
        JOIN Registro r2
            ON r1.fkCaixa = r2.fkCaixa AND r2.dtHora > r1.dtHora
        WHERE r1.fkCaixa = ${caixaId}
        AND TIMESTAMPDIFF(MINUTE, r1.dtHora, r2.dtHora) > 5
        ORDER BY r1.dtHora ASC;
    `;
    return database.executar(instrucaoSql);
}


module.exports = {
    mostrarDados,
    obterDowntime
};