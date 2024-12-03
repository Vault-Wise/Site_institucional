document.addEventListener("DOMContentLoaded", () => {
    validarSessao()

    const dashPassini = document.getElementById("dashPassini");
    const dashVini = document.getElementById("dashVini");

    if (!dashPassini.classList.contains("agora")) {
      dashPassini.classList.add("agora");
    }

    if (dashVini.classList.contains("agora")) {
      dashVini.classList.remove("agora")
    }
  });

  var Servidor = 1;
  function escolherServidor() {
    if (document.getElementById('select').value == "1") {
      Servidor = 1;
    }
    else if (document.getElementById('select').value == "2" ){
      Servidor = 2;
    }

    else if(document.getElementById('select').value == "3") {
      Servidor = 3; 
  }}

document.getElementById('finalizarBtn').addEventListener('click', () => {

    const pid = document.getElementById('pidInput').value;

    if (!pid || isNaN(pid)) {
      document.getElementById('status').innerText = 'Por favor, insira um PID válido.';
      return;
    }

    // Enviar uma requisição para o backend (API Node.js)
    fetch(`http://localhost:3333/dashPassini/rota/${pid}`)
      // http://localhost:3333/matar-processo/${pid}
      .then(response => response.text())
      .then(data => {
        console.log(data)
        document.getElementById('status').innerText = `Resultado: ${data}`;
      })
      .catch(error => {
        document.getElementById('status').innerText = `Erro: ${error.message}`;
      });
  });

  const optionsUpload = {
  series: [{ name: "Upload", data: [] }],
  chart: {
    height: 250,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Velocidade de Upload',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // Alterna cores das linhas
      opacity: 0.5
    },
  },
  xaxis: {
    categories: [] // Será preenchido com os horários
  }
};

// Configuração inicial do gráfico de Download
const optionsDownload = {
  series: [{ name: "Download", data: [] }],
  chart: {
    height: 250,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Velocidade de Download',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // Alterna cores das linhas
      opacity: 0.5
    },
  },
  xaxis: {
    categories: [] // Será preenchido com os horários
  }
};

// Renderiza os gráficos
const chartUpload = new ApexCharts(document.querySelector("#chartRedeUpload"), optionsUpload);
const chartDownload = new ApexCharts(document.querySelector("#chartRedeDownload"), optionsDownload);

chartUpload.render();
chartDownload.render();
  function carregarDados() {
            let fkCaixa = Servidor;  // Substitua isso pelo valor de fkCaixa que você deseja consultar
            fetch(`http://localhost:3333/dashPassini2/capturarPIDs/${fkCaixa}`)  // Chama a API com o fkCaixa
                .then(response => response.json())  // Converte a resposta para JSON
                .then(data => {
                    // Aqui você insere os dados na tabela
                    const tabelaBody = document.querySelector('#tabelaPID tbody');
                    tabelaBody.innerHTML = '';  // Limpa a tabela antes de adicionar os dados

                    // Loop através dos dados e cria as linhas da tabela
                    data.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.idPID}</td>
                            <td>${item.numeroPID}</td>
                            <td>${item.nomeProcesso}
                            <td>${item.nivelAmeaca}</td>
                        `;
                        tabelaBody.appendChild(tr);  // Adiciona a linha na tabela
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar os dados:', error);
                });
        }

        const intervaloDeAtualizacao = 5000;  // 5 segundos

function carregarDadosRede() {
  var fkCaixa = Servidor;  // Substitua isso pelo valor de fkCaixa que você deseja consultar

  fetch(`http://localhost:3333/dashPassini2/capturarRede/${fkCaixa}`)
    .then(response => response.json())
    .then(data => {
      const categories = [];
      const upload = [];
      const download = [];

      // Preencher as categorias e dados de upload/download
      data.forEach((item, index) => {
        categories.push(`13:${35 + index}:00`); // Gerando horários fictícios (ajuste conforme necessário)
        upload.push(parseFloat(item.velocidadeUpload));
        download.push(parseFloat(item.velocidadeDownload));
      });

      // Atualiza o gráfico de Upload
      chartUpload.updateOptions({
        xaxis: {
          categories: categories  // Horários (eixo X)
        },
        series: [{
          name: "Upload",
          data: upload  // Dados de upload
        }]
      });

      // Atualiza o gráfico de Download
      chartDownload.updateOptions({
        xaxis: {
          categories: categories  // Horários (eixo X)
        },
        series: [{
          name: "Download",
          data: download  // Dados de download
        }]
      });
    })
    .catch(error => {
      console.error('Erro ao buscar os dados:', error);
    });
}

// Chama a função inicialmente
carregarDadosRede();

// Atualiza os dados a cada 5 segundos
setInterval(carregarDadosRede, intervaloDeAtualizacao);

        // Chama a função para carregar os dados quando a página for carregada
       window.onload = function() {
    carregarDados();  // Carrega os dados para a tabela
    carregarDadosRede();  // Carrega os dados para os gráficos
};
