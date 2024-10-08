var database = require("../database/config");

function mostrar_dados(idUsuario) {
    var instrucaoSql = `SELECT * FROM Registro`
    return database.executar(instrucaoSql)
}

module.exports = {
    mostrar_dados
  }