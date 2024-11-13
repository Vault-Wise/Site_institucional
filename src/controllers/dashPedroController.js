// var dashPresilliModel = require("../models/dashPedroModel");

// function capturarInformacoes(req, res) {
//     var intervaloDias = req.params.intervalo;
//     var fkCaixa = req.params.fkCaixa

//     dashPresilliModel.capturarInformacoes(intervaloDias, fkCaixa).then((resultado) => {
//         res.status(200).json(resultado);
//     });
// }

// function capturarDadosTempoReal(req, res) {
//     var fkCaixa = req.params.fkCaixa

//     dashPresilliModel.capturarDadosTempoReal(fkCaixa).then((resultado) => {
//         res.status(200).json(resultado);
//     });
// }

// function capturarMaquinas(req, res) {
//     var idAgencia = req.params.idAgencia

//     dashPresilliModel.capturarMaquinas(idAgencia).then((resultado) => {
//         res.status(200).json(resultado);
//     });
// }

// module.exports = {
//     capturarInformacoes,
//     capturarDadosTempoReal,
//     capturarMaquinas
// };