var database = require("../database/config");

//  function buscarPorId(id) {
//    var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

//    return database.executar(instrucaoSql  );
//  }

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
  var first = Math.random();


  return codigo;
}

function listar() {
  var instrucaoSql = `SELECT * FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT idEmpresa FROM Empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(razaoSocial, cnpj, cep, telefone, numero) {
  var codigo = gerarCodigo();
  var instrucaoSql = `INSERT INTO Empresa (razaoSocial, cnpj, cep, telefone, numero, codigoEmpresa) VALUES ('${razaoSocial}', '${cnpj}', '${cep}', '${telefone}', ${numero}, '${codigo}')`;

  return database.executar(instrucaoSql, [razaoSocial, cnpj, cep, telefone, numero, codigo]);
}


module.exports = {
  cadastrar,
  listar,
  buscarPorCnpj
};
// buscarPorCnpj, buscarPorId 