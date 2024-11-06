const DiasdaSemana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
]

let listaComponentes = ["Memoria", "Processador"];
let valorIntervalo = "Tempo Real";

document.addEventListener("DOMContentLoaded", () => {
    inicializarPagina();
});

// Função principal de inicialização da página
function inicializarPagina() {
    validarSessao();
    mostrarHoraAtual();
    exibirGrafico();
    debouncedValidarFiltro(listaComponentes, valorIntervalo);
    alternarDashboards();
    tituloDash.innerHTML = obterTituloDash()
}

function alternarDashboards() {
    const dashMarcela = document.getElementById("dashMarcela");
    const dashPresilli = document.getElementById("dashPresilli");
    dashMarcela.classList.toggle("agora", false);
    dashPresilli.classList.toggle("agora", true);
}

function obterTituloDash() {
    let data = new Date();
    return `${DiasdaSemana[data.getDay()]} - ${data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

function mostrarHoraAtual() {
    setInterval(() => {
        tituloDash.innerHTML = obterTituloDash();
    }, 1000);
}

// Gráfico
function exibirGrafico() {
    const options = obterOpcoesGrafico();
    const chart = new ApexCharts(document.querySelector("#graficoLinha"), options);
    chart.render();
}

function obterOpcoesGrafico() {
    return {
        chart: {
            background: "#fff",
            foreColor: '#373d3f',
            fontFamily: "Poppins, sans-serif",
            type: 'line',
            toolbar: obterToolbarOpcoes(),
            animations: obterAnimacoesGrafico()
        },
        series: obterSeriesGrafico(),
        xaxis: {
            categories: ["Sexta-Feira", "Sábado", "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira"]
        },
        colors: ['#702f94', '#004aad'],
        tooltip: {
            y: {
                formatter: val => `${val}%`
            }
        }
    };
}

function obterToolbarOpcoes() {
    return {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
        },
        export: {
            csv: {
                filename: "dados_grafico",
                columnDelimiter: ',',
                headerCategory: 'category',
                headerValue: 'value',
                categoryFormatter: x => new Date(x).toDateString(),
                valueFormatter: y => y
            },
            svg: { filename: "imagem_grafico" },
            png: { filename: "imagem_grafico" }
        },
        autoSelected: 'zoom'
    };
}

function obterAnimacoesGrafico() {
    return {
        enabled: true,
        speed: 300,
        animateGradually: {
            enabled: true,
            delay: 200
        },
        dynamicAnimation: {
            enabled: true,
            speed: 200
        }
    };
}

function obterSeriesGrafico(dadosProcessador, dadosMemoria) {
    return [
        { name: 'Processador', data: [61, 68, 72, 55, 53, 55, 57] },
        { name: 'Memória', data: [76, 78, 85, 72, 68, 40, 35] }
    ];
}

// Validar os componentes monitorados e o filtro

const debouncedValidarFiltro = debounce((listaComponentesFiltro, intervalo) => {
    console.log("Executando consulta com:", listaComponentesFiltro, intervalo);
    cardFiltroSelecionado.innerHTML = "";

    listaComponentesFiltro.forEach(componente => {
        cardFiltroSelecionado.innerHTML += `
            <div class="filtroSelecionado d-flex ai-center row">
                ${componente}
                <i class="fa-solid fa-filter fa-l"></i>
            </div>`;
    });

    const intervaloExibido = formatarIntervalo(intervalo);

    cardFiltroSelecionado.innerHTML += `
        <div class="filtroSelecionado d-flex ai-center row">
            ${intervaloExibido}
            <i class="fa-solid fa-filter fa-l"></i>
        </div>`;

    if (intervalo == "Tempo Real") {
        exibirEmTempoReal()
    } else {
        fetch(`/dashPresilli/capturarInformacoes/${intervalo}/${1}`, {

            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquina) => {

                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }
    if (listaComponentes.length == 0) {
        exibirNenhumComponente()
    } else {
        tituloGrafico.innerHTML = listaComponentes.length > 1 ? "Processador X Memoria / Tempo" : `${listaComponentes} / Tempo`
        if (listaComponentes.length == 2) {
            exibirTodosComponentes()
        } else {

            listaComponentes.forEach(componente => {
                if (componente == "Processador") {
                    exibirProcessador()
                } else {
                    exibirMemoria()
                }
            })
        }
    }
}, 200);  // atraso de 500 ms

function exibirEmTempoReal() {

}

function exibirProcessador() {
    variacao.innerHTML =
        `
    <div class="container flex-column ai-center">
        <h3>Processador</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="seguro-perigo">57%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="perigo">72%</span>
            </div>
        </div>
    </div>
    `

    tabelaProcessos.innerHTML =
        `
    <thead>
        <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Processador</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>1º</b></td>
            <td>Chrome</td>
            <td>50%</td>
        </tr>
        <tr>
            <td><b>2º</b></td>
            <td>Pagamento</td>
            <td>05%</td>
        </tr>
        <tr>
            <td><b>3º</b></td>
            <td>Depósito</td>
            <td>12%</td>
            </tr>
    </tbody>
`

}

function exibirMemoria() {
    variacao.innerHTML =
        `
    <div class="container flex-column ai-center">
        <h3>Memória</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="seguro">35%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="perigo">85%</span>
            </div>
        </div>
    </div>
    `

    tabelaProcessos.innerHTML =
        `
    <thead>
        <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Memória</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>1º</b></td>
            <td>Chrome</td>
            <td>50%</td>
        </tr>
        <tr>
            <td><b>2º</b></td>
            <td>Pagamento</td>
            <td>05%</td>
        </tr>
        <tr>
            <td><b>3º</b></td>
            <td>Depósito</td>
            <td>12%</td>
            </tr>
    </tbody>
    `

}

function exibirTodosComponentes() {
    variacao.innerHTML =
        `
    <div class="container flex-column ai-center">
        <h3>Processador</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="seguro-perigo">57%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="perigo">72%</span>
            </div>
        </div>
    </div>
    <hr>
    <div class="container flex-column ai-center">
        <h3>Memória</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="seguro">35%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="perigo">85%</span>
            </div>
        </div>
    </div>
    `

    tabelaProcessos.innerHTML =
        `
    <thead>
        <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Processador</th>
            <th>Memória</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><b>1º</b></td>
            <td>Chrome</td>
            <td>23%</td>
            <td>50%</td>
        </tr>
        <tr>
            <td><b>2º</b></td>
            <td>Pagamento</td>
            <td>10%</td>
            <td>05%</td>
        </tr>
        <tr>
            <td><b>3º</b></td>
            <td>Depósito</td>
            <td>05%</td>
            <td>12%</td>
            </tr>
    </tbody>
    `

}

function exibirNenhumComponente() {
    tituloGrafico.innerHTML = "Sem Componentes"
    tabelaProcessos.innerHTML = `
        <thead>
            <tr>
                <th>Posição</th>
                <th>Nome</th>
                <tbody>
                    <tr>
                        <td><b>1º</b></td>
                        <td>Chrome</td>
                    </tr>
                    <tr>
                        <td><b>2º</b></td>
                        <td>Pagamento</td>
                    </tr>
                    <tr>
                        <td><b>3º</b></td>
                        <td>Depósito</td>
                    </tr>
                </tbody>
            </tr>
        </thead>
        `
    variacao.innerHTML = `
    <div style="width: 100%;" class="container jc-center ai-center">
            <h2>Sem Componente</h2>
    </div>
    `
}

function selecionarComponente(situacao, componente) {
    const index = listaComponentes.indexOf(componente);

    if (index === -1) {
        listaComponentes.push(componente);
    } else {
        listaComponentes.splice(index, 1);
    }

    situacao.classList.toggle("botaoSelecionado");
    situacao.classList.toggle("botaoDeselecionado");

    debouncedValidarFiltro(listaComponentes, valorIntervalo);
}

function formatarIntervalo(intervalo) {
    if (intervalo == "Tempo Real") {
        return "Tempo Real";
    } else if (intervalo >= 30 && intervalo <= 59) {
        return `1 mês (${intervalo} Dias)`;
    } else if (intervalo >= 60 && intervalo <= 89) {
        return `2 meses (${intervalo} Dias)`;
    } else if (intervalo == 90) {
        return "3 meses";
    } else {
        return `${intervalo} Dias`;
    }
}

function atualizarValorFiltro(value) {
    const valorRange = document.getElementById("valorRange");
    valorIntervalo = value;

    if (value == 0) {
        valorRange.innerHTML = "Tempo Real";
        valorIntervalo = "Tempo Real";
    } else if (value >= 30 && value <= 59) {
        valorRange.innerHTML = `Agora até 1 mês atrás (${value} Dias)`;
    } else if (value >= 60 && value <= 89) {
        valorRange.innerHTML = `Agora até 2 meses atrás (${value} Dias)`;
    } else if (value == 90) {
        valorRange.innerHTML = `Agora até 3 meses atrás`;
    } else {
        valorRange.innerHTML = `Agora até ${value} Dias atrás`;
    }

    // Chama a função de validação com debounce para evitar múltiplas consultas ao banco
    debouncedValidarFiltro(listaComponentes, valorIntervalo);
}

// Função debounce para atrasar a execução
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}


// Parte da aparição dos Cards 

function aparecerCard(button) {
    const blur = document.getElementById('blur');
    const card = document.getElementById('cardFiltro');

    const rect = button.getBoundingClientRect();

    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;
    card.style.display = 'block';
    card.style.transform = 'scale(0.2)';

    blur.style.display = 'block';
    setTimeout(() => {
        blur.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        card.style.top = '19vh';
        card.style.left = '51vh';
        card.style.width = '450px';
        card.style.height = '450px';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 10);
}

function aplicarEfeito() {
    const blur = document.getElementById('blur');
    const cards = [document.getElementById('cardFiltro'), document.getElementById('cardRelatorio')];

    cards.forEach(card => {
        if (card.style.display === 'block') {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.2)';
        }
    });

    blur.style.opacity = '0';

    setTimeout(() => {
        blur.style.display = 'none';
        cards.forEach(card => card.style.display = 'none');
    }, 400);
}

document.getElementById("blur").onclick = aplicarEfeito;
document.getElementById("iconeX").onclick = aplicarEfeito;
document.getElementById("iconeX2").onclick = aplicarEfeito

function aparecerCardRelatorio(button) {
    const blur = document.getElementById('blur');
    const card = document.getElementById('cardRelatorio');

    const rect = button.getBoundingClientRect();

    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;
    card.style.display = 'block';
    card.style.transform = 'scale(0.2)';

    blur.style.display = 'block';
    setTimeout(() => {
        blur.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        card.style.top = '19vh';
        card.style.left = '119vh';
        card.style.width = '450px';
        card.style.height = '450px';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 10);
}
