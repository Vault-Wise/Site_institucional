// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

// Rota de cadastro da Empresa
var empresasRouter = require("./src/routes/empresas");

// Rota de cadastro da Agencia
var agenciasRouter = require("./src/routes/agencia");

// Rota de cadastro de funcionario
var usuariosRouter = require("./src/routes/usuarios");

var graficosDashRouter = require("./src/routes/graficoDash");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

// app.use("/", indexRouter);

// Uso da rota 
app.use("/usuarios", usuariosRouter);
app.use("/empresas", empresasRouter);
app.use("/graficoDash", graficosDashRouter);
app.use("/agencia", agenciasRouter);

app.listen(PORTA_APP, function () {
    console.log(`
            Acessar Ser: http://${HOST_APP}:${PORTA_APP} \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
$$\    $$\                    $$\   $$\     $$\      $$\ $$\                     
$$ |   $$ |                   $$ |  $$ |    $$ | $\  $$ |\__|                    
$$ |   $$ |$$$$$$\  $$\   $$\ $$ |$$$$$$\   $$ |$$$\ $$ |$$\  $$$$$$$\  $$$$$$\  
\$$\  $$  |\____$$\ $$ |  $$ |$$ |\_$$  _|  $$ $$ $$\$$ |$$ |$$  _____|$$  __$$\ 
 \$$\$$  / $$$$$$$ |$$ |  $$ |$$ |  $$ |    $$$$  _$$$$ |$$ |\$$$$$$\  $$$$$$$$ |
  \$$$  / $$  __$$ |$$ |  $$ |$$ |  $$ |$$\ $$$  / \$$$ |$$ | \____$$\ $$   ____|
   \$  /  \$$$$$$$ |\$$$$$$  |$$ |  \$$$$  |$$  /   \$$ |$$ |$$$$$$$  |\$$$$$$$\ 
    \_/    \_______| \______/ \__|   \____/ \__/     \__|\__|\_______/  \_______|
    \n\n\n
    Acessar Ser: http://${HOST_APP}:${PORTA_APP}                                                                                           
    `);
});
