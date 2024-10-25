var database = require("../database/config");

function autenticar(email, senha) {

    var instrucaoSql = `
          SELECT idFuncionario, nome, cargo, email, fkEmpresa FROM Funcionario WHERE email = '${email}' AND senha = '${senha}';
     `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, cpf, email, telefone, senha, cargo, idEmpresa) {

    var instrucaoSql = `
                    INSERT INTO Funcionario (nome, cpf, email, telefone, senha, cargo, fkEmpresa) 
                    VALUES ('${nome}', '${cpf}', '${email}', '${telefone}', '${senha}', '${cargo}', '${idEmpresa}');
                `;

    return database.executar(instrucaoSql);

}

function capturarDados() {
    var instrucaoSql = `SELECT telefone, email, cpf FROM Funcionario`;

    return database.executar(instrucaoSql);
}


module.exports = {
    autenticar,
    cadastrar,
    capturarDados
};
