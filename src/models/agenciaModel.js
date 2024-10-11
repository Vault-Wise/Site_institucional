var database = require("../database/config");

function listar() {
  var instrucaoSql = `SELECT idEmpresa, razaoSocial FROM Empresa`;

  return database.executar(instrucaoSql);
}

function buscarCodigo(codEmpresa) {
  var instrucaoSql = `SELECT codigoEmpresa FROM Empresa WHERE idEmpresa = '${codEmpresa}'`

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT idEmpresa FROM Empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function capturarDados() {
  var instrucaoSql = `SELECT telefone, cnpj FROM Empresa`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj, cep, telefone, numero) {
  var codigo = gerarCodigo();

  buscarCodigo(codigo).then((resultado) => {
    if (resultado.length > 0) {
      codigo = gerarCodigo();
    }
  });

  var instrucaoSql = `INSERT INTO Empresa (razaoSocial, cnpj, cep, telefone, numero, codigoEmpresa) VALUES ('${razaoSocial}', '${cnpj}', '${cep}', '${telefone}', ${numero}, '${codigo}')`;

  return database.executar(instrucaoSql, [razaoSocial, cnpj, cep, telefone, numero, codigo]);
}



module.exports = {
  cadastrar,
  listar,
  buscarPorCnpj,
  buscarCodigo,
  capturarDados
};