var database = require("../database/config");

function mostrarDados() {
    var instrucaoSql = `SELECT * FROM Registro`

    return database.executar(instrucaoSql)
}

module.exports = {
    mostrarDados
}