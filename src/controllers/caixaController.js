var caixaModel = require("../models/caixaModel");

function listarCaixas(req, res) {
    caixaModel.listarCaixas().then((resultado) => {
        res.status(200).json(resultado);
    }).catch((erro) => {
        console.log("Erro ao listar caixas:", erro);
        res.status(500).json({ erro: "Erro ao listar caixas eletrônicos" });
    });
}

module.exports = {
    listarCaixas
};
