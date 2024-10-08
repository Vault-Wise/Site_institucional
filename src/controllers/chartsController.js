var chartsModel = require("../models/chartsModel.js");

function inserir_dados(req, res) {
    var idUsuario = req.body.idUsuarioServer
    var pontuacao = req.body.pontuacaoServer
    chartsModel.inserir_dados(idUsuario, pontuacao)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.error("Não inseriu", erro)
        })
}

function mostrar_dados(req, res) {
    try {
        var idUsuario = req.query.idUsuarioServer;
        
        chartsModel.mostrar_dados(idUsuario)
            .then(function (resultado) {
                if (resultado.length >= 1) {
                    res.json({
                        dados: resultado.map(row => row.pontuacao),
                        horario: resultado.map(row => row.dt)
                    });
                } else {
                    res.status(403).send("Sem dados disponíveis");
                }
            })
            .catch(function (erro) {
                console.error("Erro ao mostrar dados: ", erro);
                res.status(500).send("Erro no servidor ao buscar dados.");
            });
    } catch (erro) {
        console.error("Erro inesperado:", erro);
        res.status(500).send("Erro inesperado no servidor.");
    }
}

module.exports = {
    inserir_dados,
    mostrar_dados
}