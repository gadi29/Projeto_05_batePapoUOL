let usuario = {name: ""};
let mensagens = [{from:"", to:"", text:"", type:"", time:""}];
let listaMensagens = document.querySelector("ul");
let agora;

nomeUsuario();

function nomeUsuario() {
    usuario.name = prompt("Digite seu nome de usuário:")
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    promise.then(enviarStatus);
    promise.catch(tratarErro);
}

setInterval(pegarMensagens, 3000);

function pegarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(carregarMensagens);
}

function carregarMensagens(response) {
    mensagens = response.data;
    renderizarMensagens();
}

function renderizarMensagens() {
    
    listaMensagens.innerHTML = "";

    for(let i=0; i < mensagens.length; i++) {
        
        listaMensagens.innerHTML += `
            <li class="caixa-msg ${mensagens[i].type}">
                <h1>
                <span class="horario">${mensagens[i].time}</span> <strong>${mensagens[i].from}</strong> ${mensagens[i].text}
                </h1>
            </li>`;
    }

    const ultimo = document.querySelector("li:last-of-type");
    ultimo.scrollIntoView();
}

function enviarStatus() {
    setInterval(manterConexao,5000);
}

function tratarErro(error) {

    if (error.response.status === 400) {
        alert("Esse nome já existe, digite um outro nome de usuário");
        nomeUsuario();
    }
}

function manterConexao() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',usuario);
}

function horarioAtual() {
    const horario = new Date();
    const hora = horario.getHours();
    const minuto = horario.getMinutes();
    const segundo = horario.getSeconds();
    
    agora = `${hora}:${minuto}:${segundo}`
}

function acionarEnter() {

    document.addEventListener("keypress", function(e) {
        if(e.key === 'Enter') {
        
            const btn = document.querySelector(".btn-enviar");
          
          btn.click();
        
        }
    });
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
    window.location.reload();
}