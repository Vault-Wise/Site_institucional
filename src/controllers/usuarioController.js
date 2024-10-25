var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var cargo = req.body.cargoServer;
    var senha = req.body.senhaServer;
    var idEmpresa = req.body.idEmpresaServer;

    usuarioModel.cadastrar(nome, cpf, email, telefone, senha, cargo, idEmpresa)
        .then(() => {
            res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
        })
        .catch(erro => {
            console.error("Erro ao cadastrar o usuário: ", erro);
            res.status(500).json({ erro: "Erro ao cadastrar o usuário." });
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
                        res.json(resultadoAutenticar[0]);
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


function capturarDados(req, res) {
    usuarioModel.capturarDados().then((resultado) => {
        res.status(200).json(resultado);
    });
}

module.exports = {
    cadastrar,
    autenticar,
    capturarDados
};
