// const { buscarPorCnpj } = require("../controllers/usuarioController");
var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
          SELECT id_usuario, nome, email, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
     `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

  function buscarPorCnpj(cnpj) {
    console.log("Buscando o CNPJ:", cnpj);
    var instrucaoSql = `SELECT id_empresa FROM empresa WHERE cnpj = '${cnpj}'`;

    
    return database.executar(instrucaoSql)
  }

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
// Função para buscar o ID da empresa com base no CNPJ
function buscarPorCnpj(cnpj) {
    console.log("Buscando o CNPJ:", cnpj);  // Log para verificar o valor do CNPJ
    var instrucaoSql = `SELECT id_empresa FROM empresa WHERE cnpj = '${cnpj}'`;
    return database.executar(instrucaoSql);
}

// Função para cadastrar o usuário
function cadastrar(nome, cpf, email, telefone, senha, cargo, cnpj) {
    console.log("Acessando o model para cadastrar o usuário:", nome, cpf, email, telefone, senha, cargo, cnpj);


                var instrucaoSql = `
                    INSERT INTO usuario (nome, cpf, email, telefone, senha, cargo, fk_empresa) 
                    VALUES ('${nome}', '${cpf}', '${email}', '${telefone}', '${senha}', '${cargo}', '${cnpj}');
                `;
                console.log("Executando a instrução SQL para inserir o usuário: \n" + instrucaoSql);

                return database.executar(instrucaoSql);
       
}




module.exports = {
    autenticar,
    cadastrar, buscarPorCnpj
};

// const { buscarPorCpf } = require("../controllers/usuarioController");
// var database = require("../database/config");

// function autenticar(email, senha) {
//     console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha);
//     var instrucaoSql = `
//           SELECT id_usuario, nome, email, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
//      `;
//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }

// function buscarPorCnpj(cnpj) {
//     var instrucaoSql = `SELECT id_empresa FROM empresa WHERE cnpj = '${cnpj}'`;
//     return database.executar(instrucaoSql).then(resultado => {
//         if (resultado.length > 0) {
//             return resultado[0].id_empresa;
//         } else {
//             throw new Error('CNPJ não encontrado');
//         }
//     });
// }

// function cadastrar(nome, cpf, email, telefone, senha, cargo, cnpj) {
//     return buscarPorCnpj(cnpj).then(id_empresa => {
//         if (!id_empresa) {
//             throw new Error('ID da empresa não encontrado.');
//         }

//         console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, cpf, email, telefone, senha, cargo, cnpj);

//         var instrucaoSql = `
//             INSERT INTO usuario (nome, cpf, email, telefone, senha, cargo, fk_empresa) VALUES ('${nome}', '${cpf}', '${email}', '${telefone}', '${senha}', '${cargo}', '${id_empresa}');
//         `;
        
//         console.log("Executando a instrução SQL: \n" + instrucaoSql);
//         return database.executar(instrucaoSql);
//     }).catch(error => {
//         console.error("Erro ao cadastrar o usuário: ", error);
//         throw error;
//     });
// }

// module.exports = {
//     autenticar,
//     cadastrar,
//     buscarPorCnpj
// };
