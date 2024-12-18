var database = require("../database/config");

function gerarCodigo() {
  var numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  var codigo = "";

  for (let i = 1; i <= 6; i++) {
    var aleatorio;
    if (i % 2 == 0) {
      aleatorio = Number(((Math.random()) * 9).toFixed());
      codigo += `${numeros[aleatorio]}`
    } else {
      aleatorio = Number(((Math.random()) * 25).toFixed());
      codigo += `${letras[aleatorio]}`
    }
  }

  return codigo;
}

function listar() {
  var instrucaoSql = `SELECT idEmpresa, razaoSocial FROM Empresa`;

  return database.executar(instrucaoSql);
}

function buscarCodigo(idEmpresa) {
  var instrucaoSql = `SELECT email, codigoEmpresa FROM Funcionario JOIN Empresa ON fkEmpresa = idEmpresa WHERE idEmpresa = ${idEmpresa} 
  AND idFuncionario = (SELECT idFuncionario FROM Funcionario ORDER BY idFuncionario LIMIT 1);`

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