const { response } = require("express");
var dashMarcelaModel = require("../models/dashMarcelaModel")

function capturarInformacoes(req, res){
    // const processoEscolhido = req.params.selectProcesso;  // Pegue o valor do parâmetro da URL
    // console.log('Processo escolhido:', processoEscolhido);  // Log para depuração
 
    dashMarcelaModel.getInformacoes()
        .then(dados => res.status(200).json(dados))
        .catch(err => {
            console.error('Erro ao obter dados da tabela:', err);  // Log do erro
            res.status(500).json({ error: err.message });
        });
 };

function obterDadosGrafico(req, res){
    dashMarcelaModel.getInformacoesGrafico()
        .then(dados => res.status(200).json(dados))
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
 };

 function obterMaquinasMonitoradas(req, res){
    dashMarcelaModel.getInformacoesGrafico()
        .then(dados => res.status(200).json(dados))
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
 };
 

function totalMaquinas(req, res){
    dashMarcelaModel.getInformacoesMaquinas()
    .then(data => res.status(200).json(data))
    .catch(err => {
        res.status(500).json({erro: err.message})
    })
} 

function alertasUltimaDia(req, res){
    dashMarcelaModel.getAlertasUltimoDia()
    .then(resultado => res.status(200).json(resultado))
    .catch(err => {
        res.status(500).json({erro: err.message})
    })
}

function ultimoCritico(req,res){
    dashMarcelaModel.getUltimoCritico()
    .then(resultado => res.status(200).json(resultado))
    .catch(err => {
        res.status(500).json({erro: err.message})
    })
}

function historicoPerigo(req,res){
    dashMarcelaModel.gethistoricoPerigo()
    .then(resultado => res.status(200).json(resultado))
    .catch(err => {
        res.status(500).json({erro: err.message})
    })
}

module.exports = {
    capturarInformacoes,
    obterDadosGrafico,
    obterMaquinasMonitoradas,
    totalMaquinas,
    alertasUltimaDia,
    ultimoCritico,
    historicoPerigo
};