const DiasdaSemana = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
]

let data = new Date()

tituloDash.innerHTML = `${DiasdaSemana[data.getDay()]} - ${data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`


function mostrarHoraAtual() {
    const DiasdaSemana = [
        "Domingo",
        "Segunda-Feira",
        "Terça-Feira",
        "Quarta-Feira",
        "Quinta-Feira",
        "Sexta-Feira",
        "Sábado"
    ]

    setInterval(() => {
        let data = new Date()

        tituloDash.innerHTML = `${DiasdaSemana[data.getDay()]} - ${data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`
    }, 1000)
}

document.addEventListener("DOMContentLoaded", () => {
    validarSessao()
    mostrarHoraAtual()

    const dashMarcela = document.getElementById("dashMarcela");
    const dashPresilli = document.getElementById("dashPresilli");

    if (dashMarcela.classList.contains("agora")) {
        dashMarcela.classList.remove("agora");
    }

    if (!dashPresilli.classList.contains("agora")) {
        dashPresilli.classList.add("agora")
    }
});

var options = {
    chart: {
        background: "#fff",
        foreColor: '#373d3f',
        fontFamily: "Poppins, sans-serif",
        type: 'line',
        toolbar: {
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
                    categoryFormatter(x) {
                        return new Date(x).toDateString()
                    },
                    valueFormatter(y) {
                        return y
                    }
                },
                svg: {
                    filename: "imagem_grafico",
                },
                png: {
                    filename: "imagem_grafico",
                }
            },
            autoSelected: 'zoom'
        },
        animations: {
            enabled: true,
            speed: 300,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        }

    },
    series: [{
        name: 'Processador',
        data: [61, 68, 72, 55, 53, 55, 57]
    }, {
        name: 'Memória',
        data: [76, 78, 85, 72, 68, 40, 35]
    }],
    xaxis: {
        categories: ["Sexta-Feira", "Sábado", "Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira"]
    },
    colors: ['#702f94', '#004aad'],
    tooltip: {
        y: {
            formatter: function (val) {
                return `${val}%`;
            }
        }
    }
}

var chart = new ApexCharts(document.querySelector("#graficoLinha"), options);

chart.render();

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
        card.style.left = '50vh';
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
        card.style.left = '83vh';
        card.style.width = '450px';
        card.style.height = '450px';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 10);
}

function atualizarValorFiltro(value) {
    const valorRange = document.getElementById("valorRange");

    if (value == 0) {
        valorRange.innerHTML = `Tempo Real`
    } else {
        valorRange.innerHTML = `Agora até ${value} Dias atrás`;
    }
}
let componentesMonitorados = [];

function selecionarComponente(situacao, componente) {
    situacao.classList.toggle("botaoSelecionado");
    situacao.classList.toggle("botaoDeselecionado");
}
