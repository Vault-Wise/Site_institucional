


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
      throw new Error(`Erro ao buscar dados da API: ${response.status} ${response.statusText}`);
    }
    dados = await response.json();
    atualizarSeletores(dados);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    tabelaCorpo.innerHTML = "<tr><td colspan='3'>Erro ao carregar dados</td></tr>";
  }
}

// Função para atualizar os seletores no DOM
function atualizarSeletores(dados) {
  const { agencias, meses } = dados;

  selecAgencia.innerHTML = "<option value='0'>Selecione a Agência</option>";
  agencias.forEach(agencia => {
    const option = document.createElement("option");
    option.value = agencia;
    option.textContent = `Agência ${agencia}`;
    selecAgencia.appendChild(option);
  });

  selecMes.innerHTML = "<option value='0'>Selecione o Mês</option>";
  meses.forEach(mes => {
    const option = document.createElement("option");
    option.value = mes;
    option.textContent = mes;
    selecMes.appendChild(option);
  });
}

// Função para atualizar a tabela com base na agência e mês
async function atualizarTabela() {
  const agencia = selecAgencia.value;
  const mes = selecMes.options[selecMes.selectedIndex]?.text || "0";
  const ano = new Date().getFullYear(); // Obtém o ano atual
  try {
    const response = await fetch(`http://localhost:3333/dashPedro/buscarAgencia/${agencia}/${ano}/${mes}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados da tabela: ${response.status} ${response.statusText}`);
    }
    const tabelaDados = await response.json();
    tabelaCorpo.innerHTML = "";
    if (tabelaDados.length > 0) {
      tabelaDados.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.agencia}</td><td>${item.maquina}</td><td>${item.indicador}</td>`;
        tabelaCorpo.appendChild(row);
      });
    } else {
      tabelaCorpo.innerHTML = "<tr><td colspan='3'>Nenhum dado encontrado</td></tr>";
    }
  } catch (error) {
    console.error("Erro ao buscar dados da tabela:", error);
  }
}

// Função para atualizar o gráfico com base na agência e mês
async function atualizarGrafico() {
  const agencia = selecAgencia.value;
  const mes = selecMes.options[selecMes.selectedIndex]?.text || "0";
  try {
    const response = await fetch(`http://localhost:3333/dashPedro/graficoPzza/${agencia}/${mes}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados para o gráfico: ${response.status} ${response.statusText}`);
    }
    const graficoDados = await response.json();
    const estados = { Alerta: 0, Crítico: 0, Normal: 0 };
    graficoDados.forEach(item => {
      estados[item.indicador] = (estados[item.indicador] || 0) + 1;
    });
    myChart.data.datasets[0].data = [estados.Alerta, estados.Crítico, estados.Normal];
    myChart.update();
  } catch (error) {
    console.error("Erro ao buscar dados para o gráfico:", error);
  }
}

// Eventos para os seletores
selecAgencia.addEventListener("change", () => {
  if (selecAgencia.value !== "0") {
    atualizarTabela();
    atualizarGrafico();
  }
});

selecMes.addEventListener("change", () => {
  if (selecMes.value !== "0") {
    atualizarTabela();
    atualizarGrafico();
  }
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
      legend: { position: "top" }
    }
  }
});


// Função para atualizar os seletores no DOM
function atualizarSeletores(dados) {
  const { agencias, meses, maquinas } = dados;

  // Preenche o seletor de Agências
  selecAgencia.innerHTML = "<option value='0'>Selecione a Agência</option>";
  agencias.forEach(agencia => {
    const option = document.createElement("option");
    option.value = agencia;
    option.textContent = `Agência ${agencia}`;
    selecAgencia.appendChild(option);
  });

  // Preenche o seletor de Meses
  selecMes.innerHTML = "<option value='0'>Selecione o Mês</option>";
  meses.forEach(mes => {
    const option = document.createElement("option");
    option.value = mes;
    option.textContent = mes;
    selecMes.appendChild(option);
  });

  // Preenche o seletor de Máquinas
  const selecMaquina = document.getElementById('selecMaquina');
  selecMaquina.innerHTML = "<option value='0'>Selecione a Máquina</option>";
  maquinas.forEach(maquina => {
    const option = document.createElement("option");
    option.value = maquina;
    option.textContent = maquina;
    selecMaquina.appendChild(option);
  });
}


// Chama a função para buscar os dados da API ao carregar a página
buscarDados();
