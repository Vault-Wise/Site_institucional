// processRoutes.js
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// Rota para matar um processo
router.get('/rota/:pid', (req, res) => { // Alterado para capturar o PID na URL
  const pid = +(req.params.pid);

 // No backend (Node.js)
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

// const express = require('express');
// const { Client } = require('ssh2'); // Usando ssh2
// const router = express.Router();

// // Detalhes da conexão SSH com a máquina remota
// const remoteMachine = {
//   host: 'IP_DA_MAQUINA_REMOTA', // Substitua pelo IP da máquina remota
//   port: 22, // A porta padrão do SSH é 22
//   username: 'SEU_USUARIO', // Usuário remoto
//   password: 'SUA_SENHA', // Senha do usuário remoto
//   // ou use privateKey: require('fs').readFileSync('/caminho/para/sua/chave_privada')
// };

// // Rota para matar um processo na máquina remota
// router.get('/rota/:pid', (req, res) => {
//   const pid = +(req.params.pid);

//   // Verificar se o PID fornecido é válido
//   if (isNaN(pid)) {
//     return res.status(400).send('PID inválido. Certifique-se de enviar um número válido.');
//   }

//   // Criar uma instância do cliente SSH
//   const conn = new Client();

//   conn.on('ready', () => {
//     console.log('Conectado com sucesso à máquina remota');

//     // Tentar finalizar o processo com o comando kill
//     conn.exec(sudo kill -15 ${pid}, (err, stream) => {
//       if (err) {
//         conn.end();
//         return res.status(500).send(Erro ao tentar matar o processo: ${err.message});
//       }

//       stream.on('close', (code, signal) => {
//         if (code === 0) {
//           res.send(Processo com PID ${pid} foi finalizado com sucesso na máquina remota.);
//         } else {
//           res.status(500).send(Erro ao finalizar o processo, código de saída: ${code});
//         }
//         conn.end(); // Fecha a conexão SSH após a execução
//       }).on('data', (data) => {
//         console.log('stdo