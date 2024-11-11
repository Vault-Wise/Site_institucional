var database = require("../database/config");

function listarCaixas() {
    var instrucaoSql = `
        SELECT idCaixa, nomeEquipamento 
        FROM CaixaEletronico;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listarCaixas
};
