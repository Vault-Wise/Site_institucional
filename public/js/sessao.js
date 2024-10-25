function validarSessao() {
    var nome = sessionStorage.NOME_USUARIO;
    var cargo = sessionStorage.CARGO_USUARIO;
    var email = sessionStorage.EMAIL_USUARIO;

    listaNavegacao.innerHTML += `
        <li>
          <a href="home.html" class="agora">
            <i class="fas fa-lightbulb"></i>
            <span>Home</span>
          </a>
        </li>`

    if (email != null || nome != null) {
        b_usuario.innerHTML = nome
    } else {
        window.location = "../login.html";
    }

    if (cargo == "Supervisor(a) Técnica") {
        listaNavegacao.innerHTML += `
        <li>
          <a href="maquinas.html">
            <i class="fas fa-solid fa-desktop"></i>
            <span>Máquinas</span></a>
        </li>
        `
    } else if (cargo == "Analista de Dados") {
        listaNavegacao.innerHTML += `
        <li>
          <a href="alerta.html">
            <i class="fas fa-solid fa-desktop"></i>
            <span>Alerta</span></a>
        </li>
        `
    } else if (cargo == "Chefe de Ciber Segurança") {
        listaNavegacao.innerHTML += `
        <li>
          <a href="rede.html">
            <i class="fas fa-solid fa-desktop"></i>
            <span>Rede</span></a>
        </li>
        `
    }

    listaNavegacao.innerHTML += `
        <li>
          <a href="">
            <i class="fas fa-solid fa-gear"></i>
            <span>Configurações</span></a>
        </li>
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