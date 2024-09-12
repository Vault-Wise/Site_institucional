var usuarioModel = require("../models/usuarioModel");

 function buscarPorCnpj(req, res) {
   var cnpj = req.query.cnpj;
   var cnpj = resultado[0].cnpj;

   usuarioModel.buscarPorCnpj(cnpj).then((resultado) => {
     res.status(200).json(resultado);
   });
 }

//  function listar(req, res) {
//    usuarioModel.listar().then((resultado) => {
//      res.status(200).json(resultado);
//    });
//  }

//  function buscarPorId(req, res) {
//    var id = req.params.id_usuario;

//    usuarioModel.buscarPorId(id).then((resultado) => {
//      res.status(200).json(resultado);
//    });
//   }

// function cadastrar(req, res) {
//   var nome = req.body.nomeServer;
//   var cpf = req.body.cpfServer;
//   var email = req.body.emailServer;
//   var telefone = req.body.telefoneServer;
//   var cargo = req.body.cargoServer;
//   var senha = req.body.senhaServer;
//   var cnpjValidacao

//  usuarioModel.buscarPorCnpj(cnpjValidacao).then((resultado) => {
//    if (resultado.length > 0) {
//      res
//        .status(401)
//        .json({ mensagem: `a usuario com o cnpj ${cnpj} já existe` });
//    } else {
//      usuarioModel.cadastrar(nome, cpf, email, telefone, cargo, senha).then((resultado) => {
//        res.status(201).json(resultado);
//      });
//    }
//  });
// }



  // Verificar se o CNPJ existe e pegar o cnpj
  function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var cargo = req.body.cargoServer;
    var senha = req.body.senhaServer;
    var cnpjValidacao = req.body.cnpjValidacaoServer;
  
    // Verificar se o CNPJ existe e pegar o id_empresa
    usuarioModel.buscarPorCnpj(cnpjValidacao).then(resultado => {
        if (resultado.length > 0) {
            // Recupera o id da empresa a partir do resultado
            var id_empresa = resultado[0].id_empresa;
            console.log(id_empresa)
  
            // CNPJ válido, prosseguir com o cadastro do usuário
            usuarioModel.cadastrar(nome, cpf, email, telefone, senha, cargo, id_empresa)
                .then(() => {
                    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
                })
                .catch(erro => {
                    console.error("Erro ao cadastrar o usuário: ", erro);
                    res.status(500).json({ erro: "Erro ao cadastrar o usuário." });
                });
        } else {
            // CNPJ não encontrado
            res.status(404).json({ mensagem: "Empresa com o CNPJ informado não encontrada." });
        }
    }).catch(erro => {
        console.error("Erro ao buscar o CNPJ: ", erro);
        res.status(500).json({ erro: "Erro ao verificar o CNPJ." });
    });
  }
  
function autenticar(req, res) {
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  if (email == undefined) {
      res.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
      res.status(400).send("Sua senha está indefinida!");
  } else {

      usuarioModel.autenticar(email, senha)
          .then(
              function (resultadoAutenticar) {
                  console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                  console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                  if (resultadoAutenticar.length == 1) {
                      console.log(resultadoAutenticar);
                              if (resultadoAutenticar.length > 0) {
                                  res.json({
                                      id: resultadoAutenticar[0].id,
                                      email: resultadoAutenticar[0].email,
                                      nome: resultadoAutenticar[0].nome,
                                      senha: resultadoAutenticar[0].senha
                                  });
                              } else {
                                  res.status(204).json({ aquarios: [] });
                              }
                  } else if (resultadoAutenticar.length == 0) {
                      res.status(403).send("Email e/ou senha inválido(s)");
                  } else {
                      res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                  }
              }
          ).catch(
              function (erro) {
                  console.log(erro);
                  console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                  res.status(500).json(erro.sqlMessage);
              }
          );
  }

}


module.exports = {
  cadastrar,buscarPorCnpj, autenticar
};

// buscarPorCnpj,buscarPorId,listar
