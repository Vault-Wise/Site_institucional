// Definindo as variáveis que referenciam os elementos do DOM
const selecAgencia = document.getElementById('selecAgencia');
const selecMes = document.getElementById('selecMes');
const tabelaCorpo = document.getElementById('tabelaCorpo');
const pid = document.getElementById('pidInput').value; 

let dados = {}; // Variável para armazenar os dados recebidos da API

// Função para buscar os dados da API
async function buscarDados() {
  try {
    const response = await fetch(`http://localhost:3333/dashPedro/listar`);
    if (!response.ok) {
      console.error(`Erro ao buscar dados da API: ${response.statusText}`);
      throw new Error("Erro ao buscar dados da API");
    }
    dados = await response.json();
    atualizarSeletores(); // Chama a função para atualizar os seletores após a resposta
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    tabelaCorpo.innerHTML = "<tr><td colspan='3'>Erro ao carregar dados</td></tr>";
  }
}

// Função para atualizar os seletores de agência e mês
async function atualizarSeletores() {
  try {
    const response = await fetch(`http://localhost:3333/dashPedro/seletores`);
    if (!response.ok) {
      console.error(`Erro ao buscar seletores: ${response.statusText}`);
      throw new Error("Erro ao buscar seletores");
    }
    const seletores = await response.json();
    const agencias = seletores.agencias;
    selecAgencia.innerHTML = "<option value='0'>Selecione a Agência</option>";
    agencias.forEach((agencia) => {
      const option = document.createElement("option");
      option.value = agencia;
      option.textContent = `Agência ${agencia}`;
      selecAgencia.appendChild(option);
    });

    selecMes.innerHTML = "<option value='0'>Selecione o Mês</option>";
    if (agencias.length > 0) {
      const meses = seletores.meses;
      meses.forEach((mes) => {
        const option = document.createElement("option");
        option.value = mes;
        option.textContent = mes;
        selecMes.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar seletores:", error);
  }
}

// Função para atualizar a tabela com base na agência e mês selecionados
async function atualizarTabela() {
  const agencia = selecAgencia.value;
  const mes = selecMes.options[selecMes.selectedIndex]?.text || "0";
  try {
    const response = await fetch(`http://localhost:3333/dashPedro/buscarAgencia/${agencia}/${ano}/${mes}`);
    if (!response.ok) {
      console.error(`Erro ao buscar dados da tabela: ${response.statusText}`);
      throw new Error("Erro ao buscar dados da tabela");
    }
    const tabelaDados = await response.json();
    tabelaCorpo.innerHTML = "";
    if (tabelaDados.length > 0) {
      tabelaDados.forEach(item => {
        const row = document.createElement("tr");
        const tdAgencia = document.createElement("td");
        tdAgencia.textContent = item.agencia;
        const tdMaquina = document.createElement("td");
        tdMaquina.textContent = item.maquina;
        const tdIndicador = document.createElement("td");
        tdIndicador.textContent = item.indicador;
        
        row.appendChild(tdAgencia);
        row.appendChild(tdMaquina);
        row.appendChild(tdIndicador);
        
        tabelaCorpo.appendChild(row);
      });
    } else {
      tabelaCorpo.innerHTML = "<tr><td colspan='3'>Nenhum dado encontrado</td></tr>";
    }
  } catch (error) {
    console.error("Erro ao buscar dados da tabela:", error);
  }
}

// Função para atualizar o gráfico com base na agência e mês selecionados
async function atualizarGrafico() {
  const agencia = selecAgencia.value;
  const mes = selecMes.options[selecMes.selectedIndex]?.text || "0";
  try {
    const response = await fetch(`http://localhost:3333/dashPedro/graficoPzza/${agencia}/${mes}`);
    if (!response.ok) {
      console.error(`Erro ao buscar dados para o gráfico: ${response.statusText}`);
      throw new Error("Erro ao buscar dados para o gráfico");
    }
    const graficoDados = await response.json();
    const estados = { Alerta: 0, Crítico: 0, Normal: 0 };
    graficoDados.forEach(item => {
      estados[item.indicador] = (estados[item.indicador] || 0) + 1;
    });
    const chartData = [estados.Alerta, estados.Crítico, estados.Normal];
    myChart.data.datasets[0].data = chartData;
    myChart.update();
  } catch (error) {
    console.error("Erro ao buscar dados para o gráfico:", error);
  }
}

// Adiciona os eventos para os seletores de agência e mês
selecAgencia.addEventListener("change", () => {
  atualizarTabela();
  atualizarGrafico();
});

selecMes.addEventListener("change", () => {
  atualizarTabela();
  atualizarGrafico();
});

// Inicializa o gráfico vazio
const ctx = document.getElementById("myPieChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Alerta", "Crítico", "Normal"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#FFE066", "#FF6B6B", "#4CAF50"]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    }
  }
});

// Chama a função para buscar os dados da API ao carregar a página
buscarDados();

