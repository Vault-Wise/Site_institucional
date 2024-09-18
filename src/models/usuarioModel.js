var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
          SELECT idUsuario, nome, email, fkEmpresa as empresaId FROM Usuario WHERE email = '${email}' AND senha = '${senha}';
     `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Função para cadastrar o usuário
function cadastrar(nome, cpf, email, telefone, senha, cargo, idEmpresa) {

    var instrucaoSql = `
                    INSERT INTO Funcionario (nome, cpf, email, telefone, senha, cargo, fkEmpresa) 
                    VALUES ('${nome}', '${cpf}', '${email}', '${telefone}', '${senha}', '${cargo}', '${idEmpresa}');
                `;

    return database.executar(instrucaoSql);

}



module.exports = {
    autenticar,
    cadastrar
};
