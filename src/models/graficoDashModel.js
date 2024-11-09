var database = require("../database/config");

function mostrarDados() {
    var instrucaoSql = `
        SELECT 
            dtHora, 
            percentMemoria, 
            percentProcessador, 
            velocidadeUpload, 
            velocidadeDownload 
        FROM Registro 
        ORDER BY dtHora DESC 
        LIMIT 10
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    mostrarDados
}