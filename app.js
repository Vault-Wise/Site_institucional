// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });
const { GoogleGenerativeAI } = require("@google/generative-ai");

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;
const chatIA = new GoogleGenerativeAI(process.env.MINHA_CHAVE);

var app = express();

// Rota de cadastro da Empresa
var empresasRouter = require("./src/routes/empresas");

// Rota de cadastro da Agencia
var agenciasRouter = require("./src/routes/agencia");

// Rota de cadastro de funcionario
var usuariosRouter = require("./src/routes/usuarios");

// Rotas de Dashboard
var graficosDashRouter = require("./src/routes/graficoDash");

var dashPresilli = require("./src/routes/dashPresilli");

var dashMarcela = require("./src/routes/marcelaRouter")

// var dashPedro = require("./src/routes/dashPedro");

var caixaRouter = require("./src/routes/caixas");

var apiKillPDI = require("./src/dashPassini/routerDash")

var dashPassini = require("./src/routes/dashPassini");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});
// app.use("/", indexRouter);

// Uso da rota 
app.use("/usuarios", usuariosRouter);
app.use("/empresas", empresasRouter);
app.use("/graficoDash", graficosDashRouter);
app.use("/agencia", agenciasRouter);
app.use("/dashPresilli", dashPresilli);
// app.use("/dashPedro", dashPedro);
app.use("/caixas", caixaRouter);
app.use("/dashPassini", apiKillPDI)
app.use("/dashPassini2", dashPassini)
app.use("/marcelaRouter", dashMarcela)

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


var conversa = []
const contexto = `
    Contexto Resumido para Suporte ao Projeto VaultWise
    O VaultWise é um projeto focado em garantir o funcionamento eficiente, seguro e contínuo de ATMs por meio de monitoramento em tempo real, manutenção preventiva e otimização de desempenho. O objetivo é melhorar a experiência do usuário, atender aos requisitos regulatórios e fortalecer a segurança e confiabilidade do sistema financeiro.

    Principais Objetivos:

    Monitoramento Contínuo: Acompanhar CPU, memória, disco e rede em tempo real.
    Detecção de Anomalias: Identificar irregularidades e ameaças rapidamente.
    Manutenção Preventiva: Antecipar falhas e planejar intervenções com impacto mínimo.
    Segurança: Proteger contra atividades maliciosas e garantir a integridade dos dados.
    Conformidade e Relatórios: Atender a normas regulatórias com relatórios detalhados e fornecer insights para otimização.
    Satisfação do Cliente: Garantir transações rápidas e reduzir o tempo de inatividade dos ATMs.
    Escopo do Projeto:

    Monitoramento contínuo de ATMs usando Python para coleta de dados e R para análises.
    Criação de dashboards visuais a partir de dados armazenados em banco de dados.
    Configuração de instâncias EC2 na nuvem para coleta remota de dados.
    Desenvolvimento de documentação detalhada, protótipo de site institucional conectado ao banco de dados e telas específicas para diferentes personas.
    Uso de ferramentas de planejamento (Planner) e metodologias Lean UX Canvas e User Stories para organização e desenvolvimento do projeto.
    Justificativa: Garantir operação ininterrupta e segura de ATMs, com foco em desempenho, segurança e satisfação do cliente, utilizando práticas modernas de monitoramento, análise de dados e infraestrutura tecnológica.

    Essa IA apoiará na organização, planejamento e execução das tarefas, auxiliando com insights, soluções técnicas, validações de etapas e geração de relatórios para o projeto VaultWise.

    NOME DO PROJETO:
    O nome do projeto o qual você está inserida é VaultWise.

    De acordo com esse contexto responda com uma linguagem em formal e em HTML e amigável:
    `;

conversa.push(contexto)

// rota para receber perguntas e gerar respostas
app.post("/perguntar", async (req, res) => {
    const pergunta = req.body.pergunta;

    var perguntaFormat = `Usuario: ${pergunta}`
    conversa.push(perguntaFormat)

    try {
        const resultado = await gerarResposta(conversa);
        var resultadoFormat = `IA: ${resultado}`
        conversa.push(resultadoFormat)
        res.json( { resultado } );
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }

});

async function gerarResposta(mensagem) {
    // obtendo o modelo de IA
    const modeloIA = chatIA.getGenerativeModel({ model: "gemini-pro" });

    try {
        // gerando conteúdo com base na pergunta
        const resultado = await modeloIA.generateContent(`${mensagem}`);
        const resposta = await resultado.response.text();
        
        console.log(resposta);

        return resposta;
    } catch (error) {
        console.error(error);
        throw error;
    }
}