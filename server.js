// server.js
const express = require('express');
const cors = require('cors');
const processRoutes = require('./processRoutes'); // Importa as rotas que criamos
const app = express();
const port = 3333;

// Usar CORS, caso seja necessário (para aceitar requisições de origens diferentes)
app.use(cors());

// Usar o router de processos na API principal
app.use('/api', processRoutes); // Isso faz com que as rotas sejam prefixadas com /api

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
