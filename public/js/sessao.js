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
          <a id="" href="dashPresilli.html">
            <i class="fas fa-solid fa-desktop"></i>
            <span>Máquinas</span></a>
        </li>
        `
  } else if (cargo == "Analista de Dados") {
    listaNavegacao.innerHTML += `
      <li>
        <a href="dashPedro.html" class="agora">
          <i class="fas fa-lightbulb"></i>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a href="dashNicolas.html">
          <i class="fas fa-solid fa-desktop"></i>
          <span>Máquinas</span></a>
      </li>
      <li>
          <a href="">
            <i class="fas fa-solid fa-gear"></i>
            <span>Configurações</span></a>
        </li>
      `
  } else if (cargo == "Chefe de Ciber Segurança") {
    listaNavegacao.innerHTML += `
      <li>
        <a href="dashVinicius.html" class="agora">
          <i class="fas fa-lightbulb"></i>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a href="dashPassini.html">
          <i class="fas fa-solid fa-desktop"></i>
          <span>Máquinas</span></a>
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