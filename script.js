let usuario = {name: ""};
let mensagens = [{from:"", to:"", text:"", type:"", time:""}];
let listaMensagens = document.querySelector("ul");
let agora;

function entrarUsuario() {

    const escolherUsuario = document.querySelector(".tela-inicial input").value;
    usuario.name = escolherUsuario;
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    promise.then(telaMensagens);
    promise.catch(tratarErro);
}

function telaMensagens() {

    pegarMensagens();

    document.querySelector(".tela-inicial").classList.add("escondida");
    document.querySelector("header").classList.remove("escondida");
    document.querySelector(".barra-msg").classList.remove("escondida");

    setInterval(manterConexao,5000);
    setInterval(pegarMensagens, 3000);
}

function tratarErro(error) {

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
    
    const ultimo = document.querySelector("li:last-of-type");
    ultimo.scrollIntoView();
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
        
            const btn = document.querySelector(".enviar-msg");
            btn.click();
        }
    });
}