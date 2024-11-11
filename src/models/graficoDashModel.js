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
        LIMIT 30
    `;
    return database.executar(instrucaoSql);
}

function obterMaquinas() {
    var instrucaoSql = `
        SELECT DISTINCT agencia, maquina 
        FROM Registro
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    mostrarDados,
    obterMaquinas
};