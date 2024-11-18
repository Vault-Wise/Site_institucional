const DiasdaSemana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
]

let listaComponentes = ["Memoria", "CPU"];
let valorIntervalo = "Tempo Real";

let intervaloTempoReal;
let chart;

let idMaquina = 1;

document.addEventListener("DOMContentLoaded", () => {
    inicializarPagina();
});

// Função principal de inicialização da página
function inicializarPagina() {
    capturarMaquinas()
    validarSessao();
    mostrarHoraAtual();
    capturarPrimeiroDado();
    debouncedValidarFiltro(listaComponentes, valorIntervalo, idMaquina);
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
    idMaquina = select_maquina.value
    debouncedValidarFiltro(listaComponentes, valorIntervalo, select_maquina.value)
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
function exibirGrafico(listaCPU, listaMemoria, listaEixoX) {
    const options = obterOpcoesGrafico(listaCPU, listaMemoria, listaEixoX);

    chart = new ApexCharts(document.querySelector("#graficoLinha"), options);
    chart.render();
}

function obterOpcoesGrafico(listaCPU, listaMemoria, dadosEixoX) {
    return {
        chart: {
            background: "#fff",
            foreColor: '#373d3f',
            width: '100%', 
            height: '85%',
            fontFamily: "Poppins, sans-serif",
            type: 'line',
            toolbar: obterToolbarOpcoes(),
            animations: obterAnimacoesGrafico()
        },
        series: obterSeriesGrafico(listaCPU, listaMemoria),
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
            speed: 350  
        }

    };
}

function obterSeriesGrafico(dadosCPU, dadosMemoria) {
    return [
        {
            name: 'CPU',
            data: dadosCPU,
            color: '#702f94'  // Cor específica para o CPU
        },
        {
            name: 'Memória',
            data: dadosMemoria,
            color: '#004aad'  // Cor específica para a Memória
        }
    ];
}

function atualizarGrafico(novosDadosCPU, novosDadosMemoria, novasCategoriasX) {
    chart.resetSeries();

    chart.updateOptions({
        xaxis: {
            categories: novasCategoriasX
        }
    });

    if (novosDadosMemoria != null && novosDadosCPU != null) {
        chart.updateSeries([
            {
                name: 'CPU', data: novosDadosCPU,
                color: '#702f94'
            },
            {
                name: 'Memória', data: novosDadosMemoria,
                color: '#004aad'
            }
        ]);
    } else if (novosDadosCPU != null) {
        chart.updateSeries([
            {
                name: 'CPU', data: novosDadosCPU,
                color: '#702f94'
            }
        ]);
    } else if (novosDadosMemoria != null) {
        chart.updateSeries([
            {
                name: 'Memória', data: novosDadosMemoria,
                color: '#004aad'
            }
        ])
    } else {
        chart.updateOptions({
            xaxis: {
                categories: []
            }
        });
        chart.updateSeries([
            {
                name: 'Memória', data: [],
                name: 'CPU', data: [],
            }
        ])
    }
}


function atualizarGraficoTempoReal(novoDadoCPU, novoDadoMemoria, novaCategoriaX) {
    let seriesData = chart.w.globals.series ;
    let eixoXAtual = chart.w.globals.categoryLabels;

    // console.log(seriesData[0]);
    // console.log(seriesData[0][seriesData[0].length - 1]);
    // console.log(eixoXAtual)
    if (novoDadoMemoria != null && novoDadoCPU != null) {
        if (novoDadoCPU != seriesData[0][seriesData[0].length - 1]) {
            seriesData[0].shift()
            seriesData[1].shift()
            seriesData[0].push(novoDadoCPU)
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
    } else if (novoDadoCPU != null) {
        if (novoDadoCPU != seriesData[0][seriesData[0].length - 1]) {
            seriesData[0].shift()
            seriesData[0].push(novoDadoCPU)
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

const debouncedValidarFiltro = debounce((listaComponentesFiltro, intervalo, idMaquina) => {
    console.log("Executando consulta com:", listaComponentesFiltro, intervalo, idMaquina);
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
        tituloGrafico.innerHTML = listaComponentes.length > 1 ? "CPU X Memória / Tempo" : `${listaComponentes} / Tempo`
        if (listaComponentes.length == 0) {
            exibirNenhumComponente()
        } else if (listaComponentes.length == 2) {
            exibirEmTempoReal(idMaquina)
        } else if (listaComponentes.includes("CPU")) {
            exibirTempoRealCPU(idMaquina)
        } else {
            exibirTempoRealMemoria(idMaquina)
        }
    } else {
        clearInterval(intervaloTempoReal)

        if (listaComponentes.length == 0) {
            exibirNenhumComponente()
        } else {
            tituloGrafico.innerHTML = listaComponentes.length > 1 ? "CPU X Memória / Tempo" : `${listaComponentes} / Tempo`
            if (listaComponentes.length == 2) {
                exibirTodosComponentesIntervalo(intervalo, idMaquina)
            } else {
                if (listaComponentes.includes("CPU")) {
                    exibirCPUIntervalo(intervalo, idMaquina)
                } else {
                    exibirMemoriaIntervalo(intervalo, idMaquina)
                }
            }
        }
    }

}, 500);

function capturarPrimeiroDado() {
    fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaCPU = [];
                var listaMemoria = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaCPU.push(dadoDaVez.percentCPU);
                    listaMemoria.push(dadoDaVez.percentMemoria);
                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                exibirGrafico(listaCPU, listaMemoria, listaEixoX);
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function exibirEmTempoReal(idMaquina) {
    clearInterval(intervaloTempoReal)

    fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaCPU = [];
                var listaMemoria = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaCPU.push(dadoDaVez.percentCPU);
                    listaMemoria.push(dadoDaVez.percentMemoria);
                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                atualizarGrafico(listaCPU, listaMemoria, listaEixoX);
                exibirTodosComponentes()
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoReal = setInterval(() => {
        fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquinaTempoReal) => {
                    var dadoCPU;
                    var dadoMemoria;
                    var dadoEixoX;

                    for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                        const dadoDaVez = dadosMaquinaTempoReal[i];

                        dadoCPU = dadoDaVez.percentCPU
                        dadoMemoria = dadoDaVez.percentMemoria
                        dadoEixoX = formatarData(dadoDaVez.dtHora)

                    }

                    atualizarGraficoTempoReal(dadoCPU, dadoMemoria, dadoEixoX);
                    exibirTodosComponentes()
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });


    }, 5000);
}

function exibirTempoRealMemoria(idMaquina) {
    clearInterval(intervaloTempoReal)

    fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaMemoria = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaMemoria.push(dadoDaVez.percentMemoria);

                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                atualizarGrafico(null, listaMemoria, listaEixoX);
                exibirMemoria()
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoReal = setInterval(() => {
        fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
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
                    exibirMemoria()
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }, 5000);
}

function exibirTempoRealCPU(idMaquina) {
    clearInterval(intervaloTempoReal)

    fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquinaTempoReal) => {
                var listaCPU = [];
                var listaEixoX = [];

                for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                    const dadoDaVez = dadosMaquinaTempoReal[i];

                    listaCPU.push(dadoDaVez.percentCPU);

                    listaEixoX.push(formatarData(dadoDaVez.dtHora));
                }

                // Em seguida, exibir o gráfico
                atualizarGrafico(listaCPU, null, listaEixoX);
                exibirCPU()
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoReal = setInterval(() => {
        fetch(`/dashPresilli/capturarDadosTempoReal/${idMaquina}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosMaquinaTempoReal) => {
                    var dadoCPU;
                    var dadoMemoria;
                    var dadoEixoX;

                    for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                        const dadoDaVez = dadosMaquinaTempoReal[i];

                        dadoCPU = dadoDaVez.percentCPU
                        dadoMemoria = dadoDaVez.percentMemoria
                        dadoEixoX = formatarData(dadoDaVez.dtHora)

                    }

                    atualizarGraficoTempoReal(dadoCPU, null, dadoEixoX);
                    exibirCPU()
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }, 5000);
}

function exibirTodosComponentesIntervalo(intervalo, idMaquina) {
    fetch(`/dashPresilli/capturarInformacoes/${intervalo}/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquina) => {
                var listaCPU = []
                var listaMemoria = []
                var listaDatas = []

                dadosMaquina.forEach(dado => {
                    listaCPU.push(dado.mediaCPU)
                    listaMemoria.push(dado.mediaMemoria)
                    listaDatas.push(`${DiasdaSemana[new Date(dado.dia).getDay()]} ${dado.hora} : 00`)
                })

                atualizarGrafico(listaCPU, listaMemoria, listaDatas)
                exibirTodosComponentes()
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}

function exibirCPUIntervalo(intervalo, idMaquina) {
    fetch(`/dashPresilli/capturarInformacoes/${intervalo}/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquina) => {
                var listaCPU = []
                var listaDatas = []

                dadosMaquina.forEach(dado => {
                    listaCPU.push(dado.mediaCPU)
                    listaDatas.push(`${dado.hora} : 00`)
                })

                atualizarGrafico(listaCPU, null, listaDatas)
                exibirCPU()
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function exibirMemoriaIntervalo(intervalo, idMaquina) {
    fetch(`/dashPresilli/capturarInformacoes/${intervalo}/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosMaquina) => {
                var listaMemoria = []
                var listaDatas = []

                dadosMaquina.forEach(dado => {
                    listaMemoria.push(dado.mediaMemoria)
                    listaDatas.push(`${dado.hora} : 00`)
                })

                atualizarGrafico(null, listaMemoria, listaDatas)
                exibirMemoria()
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}


function formatarData(data) {
    return `${new Date(data).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

// Exibição com filtro

// ! Exibição dos componentes exibirEmTempoReal tempo de intervalo

function exibirCPU() {
    let seriesData = chart.w.globals.series;

    let retornoDados = validarMaiorDado(seriesData)

    variacao.innerHTML =
        `
    <div class="container flex-column ai-center">
        <h3>CPU</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="${retornoDados.dadosCPU.classeMenor}">${retornoDados.dadosCPU.menor}%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="${retornoDados.dadosCPU.classeMaior}">${retornoDados.dadosCPU.maior}%</span>
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
            <th>CPU</th>
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
    let seriesData = chart.w.globals.series;

    let retornoDados = validarMaiorDado(seriesData)

    variacao.innerHTML =
        `
    <div class="container flex-column ai-center">
        <h3>Memória</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="${retornoDados.dadosMemoria.classeMenor}">${retornoDados.dadosMemoria.menor}%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="${retornoDados.dadosMemoria.classeMaior}">${retornoDados.dadosMemoria.maior}%</span>
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
    let seriesData = chart.w.globals.series;

    let retornoDados = validarMaiorDado(seriesData)

    variacao.innerHTML =
        `
    <div class="container flex-column ai-center">
        <h3>CPU</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="${retornoDados.dadosCPU.classeMenor}">${retornoDados.dadosCPU.menor}%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="${retornoDados.dadosCPU.classeMaior}">${retornoDados.dadosCPU.maior}%</span>
            </div>
        </div>
    </div>
    <hr>
    <div class="container flex-column ai-center">
        <h3>Memória</h3>
        <div class="containerMinMax d-flex row">
            <div class="container ai-center flex-column">
                <h3>Min</h3>
                <span class="${retornoDados.dadosMemoria.classeMenor}">${retornoDados.dadosMemoria.menor}%</span>
            </div>
            <div class="container ai-center flex-column">
                <h3>Max</h3>
                <span class="${retornoDados.dadosMemoria.classeMaior}">${retornoDados.dadosMemoria.maior}%</span>
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
            <th>CPU</th>
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

    atualizarGrafico(null, null, null)
}

function validarMaiorDado(dadosDoGrafico) {
    console.log(dadosDoGrafico)
    var dadosMemoria;
    var dadosCPU;
    var maiorDadoMemoria;
    var maiorDadoCPU;
    var menorDadoMemoria;
    var menorDadoCPU

    if (dadosDoGrafico.length == 2) {
        if (dadosDoGrafico[0].length == 0 || dadosDoGrafico[1].length == 0) {
            return {
                "dadosCPU": {
                    maior: "0",
                    classeMaior: "perigo",
                    menor: "0",
                    classeMenor: "perigo"
                },
                "dadosMemoria": {
                    maior: "0",
                    classeMaior: "perigo",
                    menor: "0",
                    classeMenor: "perigo"
                }

            }
        }

        dadosCPU = dadosDoGrafico[0];
        dadosMemoria = dadosDoGrafico[1];
        menorDadoCPU = dadosCPU[0];
        maiorDadoCPU = dadosCPU[0];
        menorDadoMemoria = dadosMemoria[0];
        maiorDadoMemoria = dadosMemoria[0];

        for (const dadoMemoria of dadosMemoria) {
            if (dadoMemoria > maiorDadoMemoria) {
                maiorDadoMemoria = dadoMemoria
            }

            if (dadoMemoria < menorDadoMemoria) {
                menorDadoMemoria = dadoMemoria
            }
        }

        for (const dadoCPU of dadosCPU) {
            if (dadoCPU > maiorDadoCPU) {
                maiorDadoCPU = dadoCPU
            }

            if (dadoCPU < menorDadoCPU) {
                menorDadoCPU = dadoCPU
            }
        }
    } else if (chart.w.globals.seriesNames.includes("CPU")) {
        if (dadosDoGrafico[0].length == 0) {
            return {
                "dadosCPU": {
                    maior: "0",
                    classeMaior: "perigo",
                    menor: "0",
                    classeMenor: "perigo"
                },
                "dadosMemoria": {
                    maior: "0",
                    classeMaior: "perigo",
                    menor: "0",
                    classeMenor: "perigo"
                }

            }
        }

        dadosCPU = dadosDoGrafico[0];
        menorDadoCPU = dadosCPU[0];
        maiorDadoCPU = dadosCPU[0];

        for (const dadoCPU of dadosCPU) {
            if (dadoCPU > maiorDadoCPU) {
                maiorDadoCPU = dadoCPU
            }

            if (dadoCPU < menorDadoCPU) {
                menorDadoCPU = dadoCPU
            }
        }
    } else if (chart.w.globals.seriesNames.includes("Memória")) {
        if (dadosDoGrafico[0].length == 0) {
            return {
                "dadosCPU": {
                    maior: "0",
                    classeMaior: "perigo",
                    menor: "0",
                    classeMenor: "perigo"
                },
                "dadosMemoria": {
                    maior: "0",
                    classeMaior: "perigo",
                    menor: "0",
                    classeMenor: "perigo"
                }

            }
        }

        dadosMemoria = dadosDoGrafico[0];
        menorDadoMemoria = dadosMemoria[0];
        maiorDadoMemoria = dadosMemoria[0];
        for (const dadoMemoria of dadosMemoria) {
            if (dadoMemoria > maiorDadoMemoria) {
                maiorDadoMemoria = dadoMemoria
            }

            if (dadoMemoria < menorDadoMemoria) {
                menorDadoMemoria = dadoMemoria
            }
        }
    }

    return {
        "dadosCPU": {
            maior: maiorDadoCPU,
            classeMaior: retornarClasseDado(maiorDadoCPU),
            menor: menorDadoCPU,
            classeMenor: retornarClasseDado(menorDadoCPU)
        },
        "dadosMemoria": {
            maior: maiorDadoMemoria,
            classeMaior: retornarClasseDado(maiorDadoMemoria),
            menor: menorDadoMemoria,
            classeMenor: retornarClasseDado(menorDadoMemoria)
        }

    }
}

function retornarClasseDado(dadoValidado) {
    if (dadoValidado <= 40) {
        return "seguro"
    } else if (dadoValidado <= 60) {
        return "seguro-perigo"
    } else if (dadoValidado <= 75) {
        return "alerta"
    } else {
        return "perigo"
    }
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

    debouncedValidarFiltro(listaComponentes, valorIntervalo, idMaquina);
}

function formatarIntervalo(intervalo) {
    if (intervalo == "Tempo Real") {
        return "Tempo Real";
    } else {
        return `${intervalo} horas`;
    }
}

function atualizarValorFiltro(value) {
    const valorRange = document.getElementById("valorRange");
    valorIntervalo = value;

    if (value == 0) {
        valorRange.innerHTML = "Tempo Real";
        valorIntervalo = "Tempo Real";
    } else {
        valorIntervalo = `${value}`;
        valorRange.innerHTML = `Agora até ${value} horas atrás`;
    }

    // Chama a função de validação com debounce para evitar múltiplas consultas ao banco
    debouncedValidarFiltro(listaComponentes, valorIntervalo, idMaquina);
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
        card.style.left = '53vh';
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
        card.style.left = '126vh';
        card.style.width = '450px';
        card.style.height = '450px';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 10);
}
