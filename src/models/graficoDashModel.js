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
        LIMIT 30
    `;
    return database.executar(instrucaoSql);
}


module.exports = {
    mostrarDados
};