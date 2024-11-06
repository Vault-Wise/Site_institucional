var database = require("../database/config");

function capturarInformacoes(dias, fkCaixa) {
    if(dias == "Tempo Real") {
        var instrucaoSql = 
        `
        SELECT * FROM dashPresilli;
        `
    } else {
        var instrucaoSql = `
        SELECT * 
        FROM dashPresilli
        WHERE dtHora BETWEEN DATE_SUB(NOW(), INTERVAL ${dias} DAY) AND NOW() AND fkCaixa = ${fkCaixa};
        `;
    
    }

    return database.executar(instrucaoSql);
}



module.exports = {
    capturarInformacoes
};