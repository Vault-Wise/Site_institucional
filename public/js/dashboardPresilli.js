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

let intervaloTempoReal;
let chart;

document.addEventListener("DOMContentLoaded", () => {
    inicializarPagina();
});

// Função principal de inicialização da página
function inicializarPagina() {
    capturarMaquinas()
    validarSessao();
    mostrarHoraAtual();
    capturarPrimeiroDado();
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

function capturarMaquinas() {
    fetch(`/dashPresilli/capturarMaquinas/${1}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((maquinasCadsatradas) => {
                maquinasCadsatradas.forEach(maquina => {
                    console.log(maquinasCadsatradas)
                    select_maquina.innerHTML += `
                    <option value="${maquina.idCaixa}">
                    ${maquina.nomeEquipamento}</option>
                    `
                })
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function mudarMaquina() {

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
function exibirGrafico(listaProcessador, listaMemoria, listaEixoX) {
    const options = obterOpcoesGrafico(listaProcessador, listaMemoria, listaEixoX);

    chart = new ApexCharts(document.querySelector("#graficoLinha"), options);
    chart.render();
}

function obterOpcoesGrafico(listaProcessador, listaMemoria, dadosEixoX) {
    return {
        chart: {
            background: "#fff",
            foreColor: '#373d3f',
            fontFamily: "Poppins, sans-serif",
            type: 'line',
            toolbar: obterToolbarOpcoes(),
            animations: obterAnimacoesGrafico()
        },
        series: obterSeriesGrafico(listaProcessador, listaMemoria),
        xaxis: {
            categories: dadosEixoX
        },
        markers: {
            size: 3,  // Tamanho do marcador
            colors: ['#373d3f'],  // Cor do marcador (pode ser um array para múltiplos pontos)
            strokeColor: '#373d3f',  // Cor da borda
            strokeWidth: 2,  // Largura da borda
            hover: {
                size: 8,  // Tamanho do marcador ao passar o mouse
                sizeOffset: 3,  // Aumento adicional do marcador
            },
            shape: 'circle',  // Forma do marcador
            radius: 2,  // Raio do marcador (apenas para pontos circulares)
            borderWidth: 2,  // Largura da borda do marcador
            fillOpacity: 0.8
        },
        legend: {
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
            show: true,
            position: 'top',
            horizontalAlign: 'center',
        },
        yaxis: {
            min: 0,
            max: 100
        },
        colors: ['#702f94', '#004aad'],
        tooltip: {
            y: {
                formatter: val => `${val}%`
            }
        },
        stroke: {
            width: 5,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
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
        enabled: true,  // Habilita a animação
        easing: 'easeinout',  // Tipo de animação (pode ser 'linear', 'easein', 'easeout', etc.)
        speed: 800,  // Duração da animação em milissegundos
        animateGradually: {
            enabled: true,  // Se for ativado, a animação acontece gradualmente
            delay: 150  // Atraso entre as animações das diferentes partes do gráfico
        },
        dynamicAnimation: {
            enabled: true,
            speed: 350  // Velocidade da animação para a atualização dinâmica
        }

    };
}

function obterSeriesGrafico(dadosProcessador, dadosMemoria) {
    return [
        { name: 'Processador', data: dadosProcessador },
        { name: 'Memória', data: dadosMemoria }
    ];
}

function atualizarGrafico(novosDadosProcessador, novosDadosMemoria, novasCategoriasX) {
    chart.resetSeries();

    chart.updateOptions({
        xaxis: {
            categories: novasCategoriasX
        }
    });

    if (novosDadosMemoria != null && novosDadosProcessador != null) {
        chart.updateSeries([
            { name: 'Processador', data: novosDadosProcessador },
            { name: 'Memória', data: novosDadosMemoria }
        ]);
    } else if (novosDadosProcessador != null) {
        chart.updateSeries([
            { name: 'Processador', data: novosDadosProcessador }
        ]);
    } else if (novosDadosMemoria != null) [
        chart.updateSeries([
            { name: 'Memória', data: novosDadosMemoria }
        ])
    ]
}


function atualizarGraficoTempoReal(novoDadoProcessador, novoDadoMemoria, novaCategoriaX) {
    let seriesData = chart.w.globals.series;
    let eixoXAtual = chart.w.globals.categoryLabels;

    // console.log(seriesData[0]);
    // console.log(seriesData[0][seriesData[0].length - 1]);
    // console.log(eixoXAtual)
    if (novoDadoMemoria != null && novoDadoProcessador != null) {
        if (novoDadoProcessador != seriesData[0][seriesData[0].length - 1]) {
            seriesData[0].shift()
            seriesData[1].shift()
            seriesData[0].push(novoDadoProcessador)
            seriesData[1].push(novoDadoMemoria)
            eixoXAtual.shift()
            eixoXAtual.push(novaCategoriaX)

            chart.updateSeries(
                seriesData.map(data => ({
                    data: data
                }))
            );

            chart.updateOptions({
                xaxis: {
                    categories: eixoXAtual
                }
            });
        } else {
            console.log("Sem atualizações")
        }
    } else if (novoDadoProcessador != null) {
        if (novoDadoProcessador != seriesData[0][seriesData[0].length - 1]) {
            seriesData[0].shift()
            seriesData[1].shift()
            seriesData[0].push(novoDadoProcessador)
            seriesData[1].push(novoDadoMemoria)
            eixoXAtual.shift()
            eixoXAtual.push(novaCategoriaX)

            chart.updateSeries(
                seriesData.map(data => ({
                    data: data
                }))
            );

            chart.updateOptions({
                xaxis: {
                    categories: eixoXAtual
                }
            });
        } else {
            console.log("Sem atualizações")
        }
    } 
}

const debouncedValidarFiltro = debounce((listaComponentesFiltro, intervalo) => {
    console.log("Executando consulta com:", listaComponentesFiltro, intervalo);
    // ? Aqui temos a parte para mostrar os filtros selecionados na página

    cardFiltroSelecionado.innerHTML = "";

    listaComponentesFiltro.forEach(componente => {
        cardFiltroSelecionado.innerHTML += `
            <div class="filtroSelecionado d-flex ai-center row">
                ${componente}
                <i class="fa-solid fa-filter fa-l"></i>
            </div>`;
    });

    cardFiltroSelecionado.innerHTML += `
        <div class="filtroSelecionado d-flex ai-center row">
            ${formatarIntervalo(intervalo)}
            <i class="fa-solid fa-filter fa-l"></i>
        </div>`;

    if (intervalo == "Tempo Real") {
        if (listaComponentes.length == 0) {
            exibirNenhumComponente()
        } else if (listaComponentes.length == 2) {
            exibirEmTempoReal()
        } else if (listaComponentes.includes("Processador")) {
            exibirTempoRealProcessador()
        } else {
            exibirTempoRealMemoria()
        }
    } else {
        clearInterval(intervaloTempoReal)
        var listaProcessador = []
        var listaMemoria = []
        var listaDatas = []

        fetch(`/dashPresilli/capturarInformacoes/${intervalo}/${1}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquina) => {
                    dadosMaquina.forEach(dado => {
                        listaProcessador.push(dado.dia)
                        listaMemoria.push(dado.mediamemoria)
                        listaDatas.push(dado.dia)
                    })
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
            exibirTodosComponentes(listaProcessador, listaMemoria, listaDatas)
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


}, 200);

function capturarPrimeiroDado() {
    fetch(`/dashPresilli/capturarDadosTempoReal/${1}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaProcessador = [];
                var listaMemoria = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaProcessador.push(dadoDaVez.percentProcessador);
                    listaMemoria.push(dadoDaVez.percentMemoria);
                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                exibirGrafico(listaProcessador, listaMemoria, listaEixoX);
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function exibirEmTempoReal() {
    intervaloTempoReal = setInterval(() => {
        fetch(`/dashPresilli/capturarDadosTempoReal/${1}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquinaTempoReal) => {
                    var dadoProcessador;
                    var dadoMemoria;
                    var dadoEixoX;

                    for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                        const dadoDaVez = dadosMaquinaTempoReal[i];

                        dadoProcessador = dadoDaVez.percentProcessador
                        dadoMemoria = dadoDaVez.percentMemoria
                        dadoEixoX = formatarData(dadoDaVez.dtHora)

                    }

                    atualizarGraficoTempoReal(dadoProcessador, dadoMemoria, dadoEixoX);
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }, 5000);
}

function exibirTempoRealMemoria() {
    fetch(`/dashPresilli/capturarDadosTempoReal/${1}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaMemoria = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaMemoria.push(dadoDaVez.percentProcessador);

                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                exibirGrafico(null, listaMemoria, listaEixoX);
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoReal = setInterval(() => {
        fetch(`/dashPresilli/capturarDadosTempoReal/${1}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquinaTempoReal) => {
                    var dadoMemoria;
                    var dadoEixoX;

                    for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                        const dadoDaVez = dadosMaquinaTempoReal[i];

                        dadoMemoria = dadoDaVez.percentMemoria
                        dadoEixoX = formatarData(dadoDaVez.dtHora)

                    }

                    atualizarGraficoTempoReal(null, dadoMemoria, dadoEixoX);
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }, 5000);
}

function exibirTempoRealProcessador() {
    fetch(`/dashPresilli/capturarDadosTempoReal/${1}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaProcessador = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaProcessador.push(dadoDaVez.percentProcessador);

                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                exibirGrafico(listaProcessador, null, listaEixoX);
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoReal = setInterval(() => {
        fetch(`/dashPresilli/capturarDadosTempoReal/${1}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquinaTempoReal) => {
                    var dadoProcessador;
                    var dadoMemoria;
                    var dadoEixoX;

                    for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                        const dadoDaVez = dadosMaquinaTempoReal[i];

                        dadoProcessador = dadoDaVez.percentProcessador
                        dadoMemoria = dadoDaVez.percentMemoria
                        dadoEixoX = formatarData(dadoDaVez.dtHora)

                    }

                    atualizarGraficoTempoReal(dadoProcessador, null, dadoEixoX);
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }, 5000);
}

function formatarData(data) {
    return `${new Date(data).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

// Exibição com filtro

function exibirProcessador(dadosProcessador, dadosData) {
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


    atualizarGrafico(dadosProcessador, null, dadosData)
}

function exibirMemoria(dadosMemoria, dadosData) {
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

    atualizarGrafico(null, dadosMemoria, dadosData)
}

function exibirTodosComponentes(dadosProcessador, dadosMemoria, dadosData) {
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

    atualizarGrafico(dadosProcessador, dadosMemoria, dadosData)
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
