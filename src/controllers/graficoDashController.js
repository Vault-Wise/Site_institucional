var graficosDashModel = require("../models/graficoDashModel");

function mostrarDados(req, res) {
    console.log("AAAA")
    graficosDashModel.mostrarDados().then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    mostrarDados
}