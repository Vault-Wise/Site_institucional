// processRoutes.js
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// Rota para matar um processo
router.get('/rota/:pid', (req, res) => { // Alterado para capturar o PID na URL
  const pid = +(req.params.pid);

  // Verificar se o PID fornecido é válido
  if (isNaN(pid)) {
    return res.status(400).send('PID inválido. Certifique-se de enviar um número válido.');
  }

  // Tentar finalizar o processo com o comando kill
  exec(`sudo kill -15 ${pid}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Erro ao tentar matar o processo: ${error.message}`);
    }
    if (stderr) {
      return res.status(500).send(`stderr: ${stderr}`);
    }
    res.send(`Processo com PID ${pid} foi finalizado com sucesso.`);
  });
  
  
});
module.exports = router;