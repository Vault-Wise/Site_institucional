const ctx = document.getElementById('stateChart').getContext('2d');

new Chart(ctx, {
  type: 'pie',
  datasets: {
    labels: ["Seguro", "Alerta", "Pegiro"],
    datasets: [{
      data: [48.8, 25, 29.2], // Valores para cada variável
      backgroundColor: ['#4CAF50', '#FFE066', '#FF6B6B'],
      hoverBackgroundColor: ['#4CAF50', '#FFE066', '#FF6B6B']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          }
        }
      }
    }
  }
});

new Chart(ctx, {
  type: "pie",
  data: data,
  options: options
});




