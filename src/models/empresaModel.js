var database = require("../database/config");

//  function buscarPorId(id) {
//    var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

//    return database.executar(instrucaoSql  );
//  }

 function listar() {
   var instrucaoSql = `SELECT * FROM empresa`;

   return database.executar(instrucaoSql);
 }

 function buscarPorCnpj(cnpj) {
   var instrucaoSql = `SELECT id_empresa FROM empresa WHERE cnpj = '${cnpj}'`;

   return database.executar(instrucaoSql);
 }

 function cadastrar(razaoSocial, cnpj, cep, telefone, email, senha) {
  var instrucaoSql = `INSERT INTO empresa (razao_social, cnpj, cep, telefone, email, senha) VALUES ('${razaoSocial}', '${cnpj}', '${cep}', '${telefone}', '${email}', '${senha}')`;
  
  return database.executar(instrucaoSql, [razaoSocial, cnpj, cep, telefone, email, senha] );
}


module.exports = {
  cadastrar,
  listar,buscarPorCnpj
};
// buscarPorCnpj, buscarPorId 