var database = require("../database/config");

function mostrar_dados(idUsuario) {
    var instrucaoSql = `select * from Registro where fkCaixa = ${idUsuario}`
    return database.executar(instrucaoSql)
}

module.exports = {
    inserir_dados,
    mostrar_dados
  }