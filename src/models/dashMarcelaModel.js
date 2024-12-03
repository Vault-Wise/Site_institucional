var database = require("../database/config");

function getInformacoes() {
    var instrucaoSql = `
       SELECT 
    ce.nomeEquipamento AS CaixaEletronico,
    a.tipo AS TipoAlerta
FROM 
    Alerta a
JOIN 
    Registro r ON a.fkRegistro = r.idRegistro AND a.fkCaixa = r.fkCaixa
JOIN 
    CaixaEletronico ce ON r.fkCaixa = ce.idCaixa;`;

    return database.executar(instrucaoSql);
}

function getInformacoesGrafico() {
    var instrucaoSql = `
SELECT 
    a.tipo,
    COUNT(*) AS TotalPorTipo,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT idCaixa) FROM CaixaEletronico)), 2) AS Porcentagem
FROM 
    Alerta a
JOIN 
    Registro r ON a.fkRegistro = r.idRegistro AND a.fkCaixa = r.fkCaixa
JOIN 
    CaixaEletronico ce ON r.fkCaixa = ce.idCaixa
WHERE 
    a.tipo IN ('Alerta', 'Seguro', 'Perigo')
GROUP BY 
    a.tipo;`;

    return database.executar(instrucaoSql);
}

// function numPerigo() {
//     var instrucaoSql = `
// select * from Alerta;

// SELECT 
//     COUNT(*) AS TotalPerigo
// FROM 
//     Alerta
// WHERE 
//     tipo = 'Perigo';`;
//     return database.executar(instrucaoSql);
// }


function getInformacoesMaquinas() {
    var instrucaoSql = `
SELECT COUNT(*) AS quantidade
FROM CaixaEletronico;`;
    return database.executar(instrucaoSql);
}

function getAlertasUltimoDia(){
    var instrucaoSql = `
    SELECT 
    C.nomeEquipamento AS nome_atm,
    COUNT(A.idAlerta) AS numero_alertas
FROM 
    Alerta A
JOIN 
    CaixaEletronico C ON A.fkCaixa = C.idCaixa
WHERE 
    A.dtHora >= NOW() - INTERVAL 1 DAY
GROUP BY 
    C.idCaixa, C.nomeEquipamento
ORDER BY 
    numero_alertas DESC
LIMIT 1;
    `

    return database.executar(instrucaoSql)
}

function getUltimoCritico(){
    var instrucaoSql = `
SELECT 
    DATE_FORMAT(A.dtHora, '%d/%m/%Y') AS data_hora,
    DATE_FORMAT(A.dtHora, '%H:%i') AS hora,
    C.nomeEquipamento AS nome_atm
FROM 
    Alerta A
JOIN 
    CaixaEletronico C ON A.fkCaixa = C.idCaixa
WHERE 
    A.tipo = 'Perigo'
ORDER BY 
    A.dtHora DESC
LIMIT 1;
    `

    return database.executar(instrucaoSql)
}

function gethistoricoPerigo(){
    var instrucaoSql = `
SELECT 
    DATE_FORMAT(A.dtHora, '%d/%m/%Y') AS data, -- Extrai e formata a data
    DATE_FORMAT(A.dtHora, '%H:%i:%s') AS hora, -- Extrai e formata a hora
    C.nomeEquipamento AS maquina -- Nome do equipamento associado ao alerta
FROM 
    Alerta A
JOIN 
    CaixaEletronico C ON A.fkCaixa = C.idCaixa -- Faz o JOIN para vincular alertas aos caixas eletrônicos
WHERE 
    A.tipo = 'Perigo' -- Filtra apenas os registros de tipo "Perigo"
ORDER BY 
    A.dtHora DESC;
    `
    return database.executar(instrucaoSql)
}

module.exports = {
    getInformacoes,
    getInformacoesGrafico,
    getInformacoesMaquinas,
    getAlertasUltimoDia,
    // numPerigo,
    getUltimoCritico,
    gethistoricoPerigo
};