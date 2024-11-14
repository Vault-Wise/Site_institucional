var graficosDashModel = require("../models/graficoDashModel");

function mostrarDados(req, res) {
    const caixaId = req.query.caixaId;
    graficosDashModel.mostrarDados(caixaId)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            res.status(500).send("Erro ao buscar dados");
        });
}
module.exports = {
    mostrarDados
}