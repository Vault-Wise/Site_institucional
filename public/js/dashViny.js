validarSessao();

document.addEventListener("DOMContentLoaded", () => {
  b_usuario.innerHTML = sessionStorage.NOME_USUARIO;
});


function openPopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.style.display = "flex";
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.style.display = "none";
}

// Fecha o popup ao clicar fora do conteúdo
document.addEventListener("click", (event) => {
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
});

let chartMemoria, chartProcessador;

function atualizarKPIs(caixaId) {
  if (!caixaId) return;

  fetch(`/graficoDash/mostrarDados?caixaId=${caixaId}`)
    .then((response) => response.json())
    .then((data) => {
      const ocorrenciasMemoria = data.filter(
        (item) => item.percentMemoria > 80
      ).length;
      const ocorrenciasCPU = data.filter(
        (item) => item.percentProcessador > 80
      ).length;

      const spanMemoria = document.getElementById("ocorrenciasMemoria");
      const spanCPU = document.getElementById("ocorrenciasCPU");

      // Atualiza os textos
      spanMemoria.textContent = ocorrenciasMemoria;
      spanCPU.textContent = ocorrenciasCPU;

      // Altera a classe baseado no limite
      if (ocorrenciasMemoria > 5) {
        spanMemoria.classList.add("alerta");
      } else {
        spanMemoria.classList.remove("alerta");
      }

      if (ocorrenciasCPU > 5) {
        spanCPU.classList.add("alerta");
      } else {
        spanCPU.classList.remove("alerta");
      }
    })
    .catch((error) => console.error("Erro ao calcular KPIs:", error));
}



document
  .getElementById("caixaSelect")
  .addEventListener("change", function () {
    const caixaId = this.value;

    const limiteMemoria = 90;
    const limiteCPU = 90;

    atualizarKPIs(caixaId, limiteMemoria, limiteCPU);
  });

function inicializar() {
  carregarMaquinas();
  inicializarGraficos();
  
  document
    .getElementById("caixaSelect")
    .addEventListener("change", function () {
      capturarDados(this.value);
    });
}

function carregarMaquinas() {
  fetch("/caixas/listarCaixas")
    .then((response) => response.json())
    .then((data) => {
      const caixaSelect = document.getElementById("caixaSelect");
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

function inicializarGraficos() {
  chartMemoria = new ApexCharts(document.querySelector("#chartMemoria"), {
    chart: {
      type: "line",
      animations: { enabled: true, speed: 800 },
      toolbar: { show: false },
    },
    series: [{ name: "Memória (%)", data: [] }],
    xaxis: { categories: [] },
  });
  chartMemoria.render();

  chartProcessador = new ApexCharts(
    document.querySelector("#chartProcessador"),
    {
      chart: {
        type: "line",
        animations: { enabled: true, speed: 800 },
        toolbar: { show: false },
      },
      series: [{ name: "Processador (%)", data: [] }],
      xaxis: { categories: [] },
    }
  );
  chartProcessador.render();

  chartDowntime = new ApexCharts(
    document.querySelector("#chartDowntime"),
    {
      chart: {
        type: "donut",
      },
      series: [0, 0],
      labels: ["Downtime", "Uptime"],
      colors: ["#FF4560", "#0086ff"],
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              total: {
                show: true,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,
      },
    }
  );
  chartDowntime.render();
}

function capturarDados(caixaId) {
  if (!caixaId) return;

  chartMemoria.updateSeries([{ data: [] }]);
  chartProcessador.updateSeries([{ data: [] }]);

  function atualizarGraficos() {
    fetch(`/graficoDash/mostrarDados?caixaId=${caixaId}`)
      .then((response) => response.json())
      .then((data) => {
        const times = data.map((item) =>
          new Date(item.dtHora).toLocaleTimeString()
        );
        const percentMemoriaData = data.map(
          (item) => item.percentMemoria
        );
        const percentProcessadorData = data.map(
          (item) => item.percentProcessador
        );

        chartMemoria.updateSeries([
          { name: "Memória (%)", data: percentMemoriaData },
        ]);
        chartMemoria.updateOptions({ xaxis: { categories: times } });

        chartProcessador.updateSeries([
          { name: "Processador (%)", data: percentProcessadorData },
        ]);
        chartProcessador.updateOptions({ xaxis: { categories: times } });
      })
      .catch((error) => console.log("Erro ao acessar dados: ", error));
  }

  atualizarGraficos();
  clearInterval(window.graficoInterval);
  window.graficoInterval = setInterval(atualizarGraficos, 5000);
  window.graficoInterval = setInterval(atualizarKPIs, 5000);
}

let chartDowntime;

function atualizarGraficoDowntime(caixaId) {
  if (!caixaId) return;

  fetch(`/graficoDash/obterDowntime?caixaId=${caixaId}`)
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data) || data.some(item => typeof item.downtime !== 'number')) {
          console.warn("Formato inesperado de dados recebidos para downtime.");
          return;
      }
  
      const totalTempoMonitoradoMin = data.length > 1
          ? (new Date(data[data.length - 1].inicio) - new Date(data[0].inicio)) / 60000
          : 0;
  
      const totalDowntimeMin = data.reduce(
          (acc, item) => acc + Math.max(0, item.downtime),
          0
      );
  
      const totalUptimeMin = totalDowntimeMin * 3.90;

      const totalDowntimeHoras = (totalDowntimeMin / 60000).toFixed(0);
      const totalUptimeHoras = (totalUptimeMin / 60000).toFixed(0);
  
      chartDowntime.updateSeries([
          parseFloat(totalDowntimeHoras),
          parseFloat(totalUptimeHoras),
      ]);
  
      chartDowntime.updateOptions({
          labels: ["Downtime (m)", "Uptime (m)"],
      });
  })
  .catch((error) => console.error("Erro ao calcular downtime:", error));
}

  function atualizarAltoUsoContínuo(caixaId) {
    const limiteUso = 80;
    const tempoMinutos = 10;

    fetch(`/graficoDash/obterAltoUsoContinuo?limiteUso=${limiteUso}&tempoMinutos=${tempoMinutos}`)
        .then((response) => response.json())
        .then((data) => {
            const listaAltoUso = document.getElementById("listaAltoUso");
            listaAltoUso.innerHTML = "";

            console.log("Dados recebidos:", data);
            
            if (data.length === 0) {
                listaAltoUso.innerHTML = "<li>Nenhuma máquina com alto uso contínuo encontrada.</li>";
                return;
            }

            console.log("Caixa ID selecionado:", caixaId);
            
            // Verifique os valores de fkCaixa e caixaId
            data.forEach(item => console.log(`fkCaixa: ${item.fkCaixa}, caixaId: ${caixaId}`));

            // Filtrando com conversão para garantir tipos compatíveis
            const filtroDados = data.filter(item => Number(item.fkCaixa) === Number(caixaId) && item.duracaoMinutos > tempoMinutos);
            
            console.log("Dados filtrados:", filtroDados);

            if (filtroDados.length === 0) {
                listaAltoUso.innerHTML = "<li>Maquina sem ocorrência de alto uso contínuo.</li>";
                return;
            }

            filtroDados.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.textContent = `Uso acima do limite de ${limiteUso}% por ${item.duracaoMinutos} minutos.`;
                listaAltoUso.appendChild(listItem);
            });
        })
        .catch((error) => console.error("Erro ao obter alto uso contínuo:", error));
}

document.getElementById("caixaSelect").addEventListener("change", function() {
    const caixaId = this.value;
    console.log("Mudança de caixa:", caixaId);
    atualizarAltoUsoContínuo(caixaId);
    atualizarGraficoDowntime(caixaId);
});