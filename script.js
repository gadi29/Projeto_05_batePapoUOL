let usuario = {name: ""};
let contatos = [{name: ""}];
let mensagens = [{from:"", to:"", text:"", type:"", time:""}];
let atualizaListaContatos;
let agora;

function entrarUsuario() {

    const escolherUsuario = document.querySelector(".tela-inicial input").value;
    usuario.name = escolherUsuario;
    document.querySelector(".carregamento").classList.remove("escondida");

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    promise.then(telaMensagens);
    promise.catch(tratarErro);

}

function telaMensagens() {

    pegarMensagens();
    

    document.querySelector(".tela-inicial").classList.add("escondida");
    document.querySelector(".lista-mensagens").classList.remove("escondida");

    setInterval(manterConexao, 5000);
    setInterval(pegarMensagens, 3000);
}

function tratarErro(error) {

    document.querySelector(".carregamento").classList.add("escondida");

    if (error.response.status === 400) {
        alert("Esse nome já existe, digite um outro nome de usuário");
        document.querySelector(".tela-inicial input").value = "";
    } else {
        alert(`Erro ${error.response.status}`);
    }
}

function manterConexao() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',usuario);
}

function pegarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(carregarMensagens);
}

function carregarMensagens(response) {
    mensagens = response.data;
    renderizarMensagens();
}

function renderizarMensagens() {
    
    let listaMensagens = document.querySelector(".lista-mensagens");
    listaMensagens.innerHTML = "";

    for(let i=0; i < mensagens.length; i++) {

        switch(mensagens[i].type) {
            case "status":
                listaMensagens.innerHTML += `
                <li class="caixa-msg ${mensagens[i].type}">
                    <h1>
                    <span class="horario">${mensagens[i].time}</span> <strong>${mensagens[i].from}</strong> ${mensagens[i].text}
                    </h1>
                </li>`;
                break;
            case "message":
                listaMensagens.innerHTML += `
                <li class="caixa-msg ${mensagens[i].type}">
                    <h1>
                    <span class="horario">${mensagens[i].time}</span> <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}
                    </h1>
                </li>`;
                break;
            case "private-message":
                listaMensagens.innerHTML += `
                <li class="caixa-msg ${mensagens[i].type}">
                    <h1>
                    <span class="horario">${mensagens[i].time}</span> <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}
                    </h1>
                </li>`;
                break;
        }
    }
    
    const ultimaMensagem = document.querySelector(".lista-mensagens li:last-of-type");
    ultimaMensagem.scrollIntoView();
}

function pegarContatos() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promise.then(carregarContatos);
}

function carregarContatos(response) {
    contatos = response.data;
    renderizarContatos();
}

function renderizarContatos() {
    let listaContatos = document.querySelector(".contatos");
    listaContatos.innerHTML = `
    <li>
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
    </li>`;

    for (let i=0; i<contatos.length; i++) {
        listaContatos.innerHTML += `
        <li>
            <ion-icon name="person-circle"></ion-icon>
            <span>${contatos[i].name}</span>
        </li>`
    }
}

function enviarMensagem() {

    horarioAtual();

    const textoMensagem = document.querySelector(".barra-msg input").value;
    const mensagem = {from:`${usuario.name}`, to:"Todos", text:`${textoMensagem}`, type:"message", time:`${agora}`}

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
    promise.then(pegarMensagens);
    promise.catch(atualizarSite);

    document.querySelector(".barra-msg input").value = "";
}

function atualizarSite() {
    alert("Você ficou muito tempo inativo, entre novamente...")
    window.location.reload();
}

function abrirMenuLateral() {
    pegarContatos();
    document.querySelector(".fundo-menu-lateral").classList.remove("escondida");
    document.querySelector(".menu-lateral").classList.add("com");
    atualizaListaContatos = setInterval(pegarContatos, 10000);
}

function voltarTelaMensagens() {
    document.querySelector(".fundo-menu-lateral").classList.add("escondida");
    document.querySelector(".menu-lateral").classList.remove("com");
    clearInterval(atualizaListaContatos);
}

function horarioAtual() {
    const horario = new Date();
    const hora = horario.getHours();
    const minuto = horario.getMinutes();
    const segundo = horario.getSeconds();
    
    agora = `${hora}:${minuto}:${segundo}`
}

function acionarEnter() {

    document.addEventListener("keydown", function(e) {
        if(e.key === 'Enter') {

            const btn = document.querySelector(".enviar-msg");
            btn.click();
            
        }
    });
}