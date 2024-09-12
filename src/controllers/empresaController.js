var empresaModel = require("../models/empresaModel");

 function buscarPorCnpj(req, res) {
   var cnpj = req.query.cnpj;

   empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
     res.status(200).json(resultado);
   });
 }

 function listar(req, res) {
   empresaModel.listar().then((resultado) => {
     res.status(200).json(resultado);
   });
 }

//  function buscarPorId(req, res) {
//    var id = req.params.id_empresa;

//    empresaModel.buscarPorId(id).then((resultado) => {
//      res.status(200).json(resultado);
//    });
//   }

function cadastrar(req, res) {
  var cnpj = req.body.cnpjServer;
  var razaoSocial = req.body.razaoSocialServer;
  var cep = req.body.cepServer;
  var telefone = req.body.telefoneServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

 empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
   if (resultado.length > 0) {
     res
       .status(401)
       .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
   } else {
     empresaModel.cadastrar(razaoSocial, cnpj, cep, telefone, email, senha).then((resultado) => {
       res.status(201).json(resultado);
     });
   }
 });
}

module.exports = {
  cadastrar
  ,listar,buscarPorCnpj
};
// buscarPorCnpj,buscarPorId
