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

  carregarMaquinas(); // Carregar máquinas ao inicializar
  inicializar(); // Inicializar as funções que dependem do select
});

function carregarMaquinas() {
  fetch("/caixas/listarCaixas")
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Adicione este log para depurar a resposta
      const caixaSelect = document.getElementById("select");
      caixaSelect.innerHTML = `<option disabled selected>Selecione uma máquina</option>`;

      data.forEach((caixa) => {
        const option = document.createElement("option");
        option.value = caixa.idCaixa;
        option.textContent = caixa.nomeEquipamento;
        caixaSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Erro ao carregar máquinas:", error));
}

document.getElementById('finalizarBtn').addEventListener('click', () => {
  const pid = document.getElementById('pidInput').value;

  if (!pid || isNaN(pid)) {
    document.getElementById('status').innerText = 'Por favor, insira um PID válido.';
    return;
  }

  // Enviar uma requisição para o backend (API Node.js)
  fetch(`/dashPassini/rota/${pid}`)
    .then(response => response.text())
    .then(data => {
      console.log(data)
      document.getElementById('status').innerText = `Resultado: ${data}`;
    })
    .catch(error => {
      document.getElementById('status').innerText = `Erro: ${error.message}`;
    });
});

// Função para carregar dados usando fkCaixa
function carregarDados(fkCaixa) {
  if (!fkCaixa) {
    console.error("fkCaixa é undefined ou vazio");
    return;  // Não faz a requisição se o valor for inválido
  }

  fetch(`/dashPassini2/capturarPIDs/${fkCaixa}`)
    .then(response => response.json())
    .then(data => {
      const tabelaBody = document.querySelector('#tabelaPID tbody');
      tabelaBody.innerHTML = '';

      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.idPID}</td>
          <td>${item.numeroPID}</td>
          <td>${item.nomeProcesso}</td>
          <td>${item.nivelAmeaca}</td>
        `;
        tabelaBody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
}

// Função para carregar dados de rede usando fkCaixa
function carregarDadosRede(fkCaixa) {
  if (!fkCaixa) {
    console.error("fkCaixa é undefined ou vazio");
    return;  // Não faz a requisição se o valor for inválido
  }

  fetch(`/dashPassini2/capturarRede/${fkCaixa}`)
    .then(response => response.json())
    .then(data => {
      const categories = [];
      const upload = [];
      const download = [];

      data.forEach((item, index) => {
        categories.push(`13:${35 + index}:00`);
        upload.push(parseFloat(item.velocidadeUpload));
        download.push(parseFloat(item.velocidadeDownload));
      });

      chartUpload.updateOptions({
        xaxis: { categories: categories },
        series: [{ name: "Upload", data: upload }]
      });

      chartDownload.updateOptions({
        xaxis: { categories: categories },
        series: [{ name: "Download", data: download }]
      });
    })
    .catch(error => {
      console.error('Erro ao buscar os dados:', error);
    });
}

// Configuração inicial do gráfico de Upload
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

// Inicializar as funções e configurar o listener para o select
function inicializar() {
  document.getElementById("select").addEventListener("change", function () {
    const fkCaixa = this.value;
    console.log("fkCaixa selecionado:", fkCaixa); // Verificar o valor do fkCaixa

    if (!fkCaixa) {
      alert("Por favor, selecione uma máquina válida.");
      return; // Impedir a requisição se não houver valor
    }

    carregarDados(fkCaixa);  
    carregarDadosRede(fkCaixa);  

    // Atualizar os gráficos a cada 1 minuto
    setInterval(() => {
      carregarDadosRede(fkCaixa);
      carregarDados(fkCaixa)  // Chama a função para atualizar os dados de rede
    }, 6000); // Intervalo de 1 minuto (60000 ms)
  });
}
