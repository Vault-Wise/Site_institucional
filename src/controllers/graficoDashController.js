var graficosDashModel = require("../models/graficoDashModel");

function mostrarDados(req, res) {
    const caixaId = req.query.caixaId;
    graficosDashModel.mostrarDados(caixaId)
        .then((resultado) => {
            res.status(200).json(resultado);
        });
}


module.exports = {
    mostrarDados
}