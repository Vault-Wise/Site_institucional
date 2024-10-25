function validarSessao() {
  var nome = sessionStorage.NOME_USUARIO;
  var cargo = sessionStorage.CARGO_USUARIO;
  var email = sessionStorage.EMAIL_USUARIO;


  if (email != null || nome != null) {
    b_usuario.innerHTML = nome
  } else {
    window.location = "../login.html";
  }

  if (cargo == "Supervisor(a) Técnica") {
    listaNavegacao.innerHTML += `
        <li>
          <a id="dashMarcela" href="dashMarcela.html" class="agora">
            <i class="fas fa-lightbulb"></i>
            <span>Home</span>
          </a>
        </li>
        <li>
          <a id="dashPresilli" href="dashPresilli.html">
            <i class="fas fa-solid fa-desktop"></i>
            <span>Maquina</span></a>
        </li>
        `
  } else if (cargo == "Analista de Dados") {
    listaNavegacao.innerHTML += `
      <li>
        <a id="dashPedro" href="dashPedro.html" class="agora">
          <i class="fas fa-lightbulb"></i>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a id="dashNicolas" href="dashNicolas.html">
         <i class="fa-solid fa-heart"></i>
          <span>Alerta</span></a>
      </li>
      <li>
          <a href="CadastroAgencia.html">
            <i class="fas fa-solid fa-gear"></i>
            <span>Configurações</span></a>
        </li>
      `
  } else if (cargo == "Chefe de Ciber Segurança") {
    listaNavegacao.innerHTML += `
      <li>
        <a id="dashVini" href="dashVinicius.html" class="agora">
          <i class="fas fa-lightbulb"></i>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a id="dashPassini" href="dashPassini.html">
          <i class="fas fa-solid fa-globe"></i>
          <span>Rede</span></a>
      </li>
      `
  }

  listaNavegacao.innerHTML += `
        <li>
          <a href="">
            <i class="fas fa-question-circle"></i>
            <span>Ajuda</span></a>
        </li>
        <li class="logout">
          <a href="../index.html">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sair</span></a>
        </li>
        `
}

function limparSessao() {
  sessionStorage.clear();
  window.location = "../login.html";
}