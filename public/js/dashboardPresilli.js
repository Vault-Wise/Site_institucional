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
let intervaloTempoRealProcesso;
let chart;

let idMaquina = 1;
let nomeEquipamento = "note-presilli"

var conversa = []

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
            resposta.json().then((maquinasCadastradas) => {
                maquinasCadastradas.forEach(maquina => {
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
    nomeEquipamento = select_maquina.options[select_maquina.selectedIndex].text;

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
    let seriesData = chart.w.globals.series;
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
            exibirProcessos(idMaquina)
        } else if (listaComponentes.includes("CPU")) {
            exibirTempoRealCPU(idMaquina)
            exibirProcessoProcessador(idMaquina)
        } else {
            exibirTempoRealMemoria(idMaquina)
            exibirProcessoMemoria(idMaquina)
        }
    } else {
        clearInterval(intervaloTempoReal)
        clearInterval(intervaloTempoRealProcesso)

        if (listaComponentes.length == 0) {
            exibirNenhumComponente()
        } else {
            tituloGrafico.innerHTML = listaComponentes.length > 1 ? "CPU X Memória / Tempo" : `${listaComponentes} / Tempo`
            if (listaComponentes.length == 2) {
                exibirTodosComponentesIntervalo(intervalo, idMaquina)
                exibirProcessoIntervalo(intervalo, idMaquina)
            } else {
                if (listaComponentes.includes("CPU")) {
                    exibirCPUIntervalo(intervalo, idMaquina)
                    exibirProcessoIntervaloProcessador(intervalo, idMaquina)
                } else {
                    exibirMemoriaIntervalo(intervalo, idMaquina)
                    exibirProcessoIntervaloMemoria(intervalo, idMaquina)
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


    }, 7000);
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

    }, 7000);
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
                    var dadoEixoX;

                    for (let i = dadosMaquinaTempoReal.length - 1; i >= 0; i--) {
                        const dadoDaVez = dadosMaquinaTempoReal[i];

                        dadoCPU = dadoDaVez.percentCPU
                        dadoEixoX = formatarData(dadoDaVez.dtHora)

                    }

                    atualizarGraficoTempoReal(dadoCPU, null, dadoEixoX);
                    exibirCPU()
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

    }, 7000);
}

function exibirProcessos(idMaquina) {
    clearInterval(intervaloTempoRealProcesso)

    fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
                console.log(idMaquina)
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
                <tbody id="dadosProcesso">
                </tbody>
                `

                for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                    const processoDaVez = dadosProcessos[i];

                    dadosProcesso.innerHTML += `
                    <tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentProcessador}%</td>
                        <td>${processoDaVez.percentMemoria}%</td>
                    </tr>
                    `
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoRealProcesso = setInterval(() => {
        fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosProcessos) => {

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
                <tbody id="dadosProcesso">
                </tbody>
                `

                    for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                        const processoDaVez = dadosProcessos[i];

                        dadosProcesso.innerHTML += `<tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentProcessador}%</td>
                        <td>${processoDaVez.percentMemoria}%</td>
                    </tr>
                    `
                    }
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
    }, 30000);
}

function exibirProcessoProcessador(idMaquina) {
    clearInterval(intervaloTempoRealProcesso)

    fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
                tabelaProcessos.innerHTML =
                    `
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>CPU</th>
                    </tr>
                </thead>
                <tbody id="dadosProcesso">
                </tbody>
                `

                for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                    const processoDaVez = dadosProcessos[i];

                    dadosProcesso.innerHTML += `<tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentProcessador}%</td>
                    </tr>
                    `
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoRealProcesso = setInterval(() => {
        fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosProcessos) => {
                    tabelaProcessos.innerHTML =
                        `
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                            <th>CPU</th>
                        </tr>
                    </thead>
                    <tbody id="dadosProcesso">
                    </tbody>
                    `


                    for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                        const processoDaVez = dadosProcessos[i];

                        dadosProcesso.innerHTML += `<tr>
                        <td>    }º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentProcessador}%</td>
                    </tr>
                    `
                    }
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
    }, 30000);
}

function exibirProcessoMemoria(idMaquina) {
    clearInterval(intervaloTempoRealProcesso)

    fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
                tabelaProcessos.innerHTML =
                    `
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Memória</th>
                    </tr>
                </thead>
                <tbody id="dadosProcesso">
                </tbody>
                `


                for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                    const processoDaVez = dadosProcessos[i];

                    dadosProcesso.innerHTML += `<tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentMemoria}%</td>
                    </tr>
                    `
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    intervaloTempoRealProcesso = setInterval(() => {
        fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
            method: "GET",
        })
            .then(function (resposta) {
                resposta.json().then((dadosProcessos) => {
                    tabelaProcessos.innerHTML =
                        `
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Memória</th>
                    </tr>
                </thead>
                <tbody id="dadosProcesso">
                </tbody>
                `



                    for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                        const processoDaVez = dadosProcessos[i];

                        dadosProcesso.innerHTML += `<tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentMemoria}%</td>
                    </tr>
                    `
                    }
                });
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
    }, 30000);
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

function exibirProcessoIntervalo(intervalo, idMaquina) {
    fetch(`/dashPresilli/capturaProcessosIntervalo/${intervalo}/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
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
                <tbody id="dadosProcesso">
                </tbody>
                `

                for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                    const processoDaVez = dadosProcessos[i];

                    dadosProcesso.innerHTML += `
                    <tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentProcessador}%</td>
                        <td>${processoDaVez.percentMemoria}%</td>
                    </tr>
                    `
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function exibirProcessoIntervaloProcessador(intervalo, idMaquina) {
    fetch(`/dashPresilli/capturaProcessosIntervalo/${intervalo}/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
                tabelaProcessos.innerHTML =
                    `
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>CPU</th>
                    </tr>
                </thead>
                <tbody id="dadosProcesso">
                </tbody>
                `

                for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                    const processoDaVez = dadosProcessos[i];

                    dadosProcesso.innerHTML += `
                    <tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentProcessador}%</td>
                    </tr>
                    `
                }

            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function exibirProcessoIntervaloMemoria(intervalo, idMaquina) {
    fetch(`/dashPresilli/capturaProcessosIntervalo/${intervalo}/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
                tabelaProcessos.innerHTML =
                    `
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Memória</th>
                    </tr>
                </thead>
                <tbody id="dadosProcesso">
                </tbody>
                `

                for (let i = 0; i <= dadosProcessos.length - 1; i++) {
                    const processoDaVez = dadosProcessos[i];

                    dadosProcesso.innerHTML += `
                    <tr>
                        <td><b>${i + 1}º</b></td>
                        <td>${processoDaVez.nome}</td>
                        <td>${processoDaVez.percentMemoria}%</td>
                    </tr>
                    `
                }
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function formatarData(data) {
    return `${new Date(data).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
}

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
}

function exibirNenhumComponente() {
    fetch(`/dashPresilli/capturaProcessosTempoReal/${idMaquina}`, {
        method: "GET",
    })
        .then(function (resposta) {
            resposta.json().then((dadosProcessos) => {
                tabelaProcessos.innerHTML =
                    `
                   <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>1º</b></td>
                            <td>${dadosProcessos[0].nome}</td>
                        </tr>
                        <tr>
                            <td><b>2º</b></td>
                            <td>${dadosProcessos[1].nome}</td>
                        </tr>
                        <tr>
                            <td><b>3º</b></td>
                            <td>${dadosProcessos[2].nome}</td>
                        </tr>
                    </tbody>
            `

                tituloGrafico.innerHTML = "Sem Componentes"

                variacao.innerHTML =
                    `
            <div style="width: 100%;" class="container jc-center ai-center">
                <h2>Sem Componente</h2>
            </div>
            `

                atualizarGrafico(null, null, null)
            });
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function validarMaiorDado(dadosDoGrafico) {
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

async function gerarRelatorio() {
    const graficoLinha = document.querySelector("#graficoLinha");
    const tabelaProcessos = document.querySelector("#tabelaProcessos");
    const variacao = document.querySelector("#variacao");

    const logoPath = 'http://localhost:3333/css/imagens/logoSemFundo.png';
    const dataHoraAtual = obterTituloDash();

    // Estilos customizados para o PDF
    const customStyles = `
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        text-align: center;
        color: #333;
        background-color: #f4f4f4;
    }
    .header {
        padding: 20px;
        background-color: #222;
        color: #fff;
        text-align: center;
        border-bottom: 5px solid #982727;
    }
    .header img {
        width: 120px;
        height: 100px;
        margin-bottom: 10px;
    }
    .header h1 {
        font-size: 50px; /* Fonte maior para o título */
        margin: 10px 0;
    }
    .header h2 {
        font-size: 34px; /* Aumentado */
        font-weight: normal;
        margin: 5px 0;
        color: #ddd;
    }
    .header h2 span {
        color: #982727;
        font-weight: bold;
    }
    .header p {
        font-size: 22px; /* Aumentado */
        margin-top: 10px;
    }
    .content {
        margin: 20px auto;
        width: 90%;
        background: #fff;
        padding: 25px; /* Aumentado para acomodar melhor */
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .content h2 {
        font-size: 30px; /* Aumentado */
        color: #222;
        margin-bottom: 20px;
        border-bottom: 3px solid #982727;
        display: inline-block;
    }
    table {
        width: 100%;
        margin: 20px 0;
        border-collapse: collapse;
        border: 1px solid #ddd;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    table th, table td {
        padding: 15px 20px; /* Aumentado */
        border: 1px solid #ddd;
        text-align: center;
        font-size: 18px; /* Aumentado */
    }
    table th {
        background-color: #982727;
        color: white;
        font-weight: bold;
    }
    table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    table tr:hover {
        background-color: #f1f1f1;
        cursor: pointer;
    }
    .card-variacao {
        width: 890px;
        display: flex;
        gap: 20px;
        flex-direction: row;
        justify-content: center; /* Centraliza os cartões */
        align-items: center;
        background-color: #dfdfdf;
        border-radius: 6px;
        border-bottom: 1px solid #982727;
    }
    .card-variacao div {
        font-size: 28px; /* Aumenta a fonte dos textos dentro dos cartões */
    }
    .grafico {
        width: 890px;
        display: flex;
        justify-content: center; /* Centraliza os cartões */
        align-items: center;
        border-bottom: 1px solid #982727;
    }
    </style>
`;

    // Página de capa
    const coverPage = `
    <div class="header">
        <img src="${logoPath}" alt="Logo">
        <h1>Relatório da Máquina ${nomeEquipamento}</h1>
        <h2>Gerado por <span>Vault Wise</span></h2>
        <p>Gerado em: ${dataHoraAtual}</p>
    </div>
    `;

    var contentPage = `<div class="content">`

    if (!checkGrafico.checked && !checkProcesso.checked && !checkVariacao.checked) {
        alert("Selecione uma opção ao relatório")
    }
    else {
        let perguntaGrafico;
        let perguntaVariacao;
        let perguntaProcesso;

        if (checkGrafico.checked) {
            contentPage +=
                `
            <h2>Gráfico</h2>
            <div class="grafico">${graficoLinha.outerHTML}</div>
            `

            if (valorIntervalo != "Tempo Real") {
                perguntaGrafico =
                    `
                    Valores do Gráfico
                    ${chart.w.globals.seriesNames}
                    ${chart.w.globals.series}

                    Respectivamente,

                    Com base nos dados apresentados no gráfico que monitoram o desempenho da máquina específica, 
                    analise os valores médios de utilização de CPU e Memória dentro do intervalo de ${valorIntervalo} horas, agrupados por hora.
                
                    Por favor, identifique:
                    1. Se a máquina apresenta **bom funcionamento**, com níveis estáveis e baixos de utilização dos componentes.
                    2. Se há indícios de **utilização elevada**, onde CPU ou Memória estão próximos ou acima de níveis críticos.
                    3. Qualquer padrão ou comportamento anômalo que possa indicar necessidade de atenção ou ajustes.
                
                    Detalhe possíveis conclusões sobre o estado geral da máquina nesse período, considerando as tendências e valores 
                    médios apresentados.
                    `

            }
            else {
                perguntaGrafico =
                    `
                    Valores do Gráfico
                    Componentes Monitorados: ${chart.w.globals.seriesNames}
                    Valores do Gráfico: ${chart.w.globals.series.length === 2
                        ? `${chart.w.globals.series[0]}, ${chart.w.globals.series[1]}`
                        : `${chart.w.globals.series[0]}`}

                    Respectivamente,

                    Com base nos dados apresentados no gráfico que monitoram o desempenho da máquina específica, 
                    analise os valores médios de utilização de CPU e Memória dentro do intervalo em ${valorIntervalo}, contendo os últimos 10 registros da máquina  .
                    
                    Por favor, identifique:
                    1. Se a máquina apresenta **bom funcionamento**, com níveis estáveis e baixos de utilização dos componentes.
                    2. Se há indícios de **utilização elevada**, onde CPU ou Memória estão próximos ou acima de níveis críticos.
                    3. Qualquer padrão ou comportamento anômalo que possa indicar necessidade de atenção ou ajustes.
                    
                    Resuma as possíveis conclusões sobre o estado geral da máquina nesse período, considerando as tendências e valores 
                    médios apresentados.
                    `

            }
        }

        if (checkProcesso.checked) {
            contentPage += `
            <h2>Processos</h2>
            <div>
                ${tabelaProcessos.outerHTML}
            </div>
            `;

            perguntaProcesso = `
            ${tabelaProcessos}
            Analisando os processos em execução, identifique:
            1. Quais processos estão consumindo mais CPU ou memória?
            2. Existe algum processo que está utilizando recursos de forma excessiva, o que poderia indicar um possível problema de desempenho?
            3. Existe algum processo que foi executado mais de uma vez, que poderia ser um indicativo de comportamento anômalo?
            4. Quais são os processos críticos para o funcionamento do sistema e precisam ser monitorados de perto?
        
            Considerando a tabela de processos apresentada, como você avaliaria o impacto desses processos no desempenho geral da máquina?
            `;
        }

        if (checkVariacao.checked) {
            contentPage += `
            <h2>Variação</h2>
            <div class="card-variacao">
                ${variacao.outerHTML}
            </div>
            `;

            perguntaVariacao = `
            ${variacao}
            Com base na variação apresentada, analise:
            1. Houve picos ou quedas anormais nos dados? Se sim, o que poderia ter causado esses picos?
            2. Há variações regulares no uso de recursos (CPU, memória) que podem ser consideradas normais, ou os dados indicam uma instabilidade no sistema?
            3. Alguma variação está em níveis críticos, indicando a necessidade de ajustes ou monitoramento mais atento?
            4. O comportamento de variação se alinha com o esperado para esse tipo de máquina, ou há algo incomum?
            
            A partir dos dados de variação, quais conclusões você pode tirar sobre o comportamento da máquina e seus recursos?
            `;
        }


        contentPage += `</div>`

        var perguntaTodas;
        if (perguntaGrafico != undefined && perguntaProcesso != undefined && perguntaVariacao != undefined) {
            perguntaTodas = `Me fale sobre ${perguntaGrafico} também sobre ${perguntaProcesso} e ${perguntaVariacao}`
        }
        else if (perguntaGrafico != undefined && perguntaProcesso != undefined) {
            perguntaTodas = `Me fale sobre ${perguntaGrafico} também sobre ${perguntaVariacao}`
        }
        else if (perguntaProcesso != undefined && perguntaVariacao != undefined) {
            perguntaTodas = `Me fale sobre ${perguntaProcesso} também sobre ${perguntaVariacao}`
        }
        else if (perguntaGrafico != undefined) {
            perguntaTodas = `${perguntaGrafico}`
        }
        else if (perguntaVariacao != undefined) {
            perguntaTodas = `${perguntaVariacao}`
        }
        else if (perguntaProcesso != undefined) {
            perguntaTodas = `${perguntaProcesso}`
        }


        const resposta = await gerarResposta(perguntaTodas);

        contentPage += 
        `
        <h2>Análise do Gráfico</h2>
        <p>${resposta}</p>
        `;



        fazerCarregamento()

        finalizarPDF(coverPage, contentPage, customStyles)
    }
}

function finalizarPDF(coverPage, contentPage, customStyle) {
    const options = {
        margin: [10, 10, 10, 10],
        filename: "relatorio.pdf",
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a3", orientation: "portrait" }
    };

    // Gerando o PDF
    const wrapper = document.createElement("div");
    wrapper.innerHTML = customStyle + coverPage + contentPage;
    html2pdf().set(options).from(wrapper).save();
}

const blur2 = document.getElementById('blur2');

function mostrarCarregamento() {
    blur2.style.display = 'flex';
}

function ocultarCarregamento() {
    blur2.style.display = 'none';
}

async function fazerCarregamento() {
    mostrarCarregamento();

    setTimeout(() => {
        ocultarCarregamento();
    }, 2000);
}

async function gerarResposta(pergunta) {
    const response = await fetch('/perguntar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta })
    });

    const data = await response.json();

    console.log("Resposta da API:", data);  // Verifique o formato da resposta

    // Certifique-se de que o campo 'resultado' existe antes de retornar
    return data.resultado || "Nenhum resultado retornado";
}
