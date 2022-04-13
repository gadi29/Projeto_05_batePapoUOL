let usuario = {name: ""};
let mensagens = [];

pegarMensagens();

function pegarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(carregarMensagens);
}

function carregarMensagens(response) {
    mensagens = response.data;
    renderizarMensagens();
}

function renderizarMensagens() {
    let listaMensagens = document.querySelector("ul");
    listaMensagens.innerHTML = "";

    for(let i=0; i < mensagens.length; i++) {
        console.log(mensagens[i].type);
        switch(mensagens[i].type) {
            case "status":
                listaMensagens.innerHTML += `
                <li class="caixa-msg status">
                    <span class="horario">${mensagens[i].time}</span>
                    <h1>${mensagens[i].from}</h1>
                    <h2>${mensagens[i].text}</h2>
                </li>`;
                break;
            case "message":
                listaMensagens.innerHTML += `
                <li class="caixa-msg">
                    <span class="horario">${mensagens[i].time}</span>
                    <h1>${mensagens[i].from}</h1>
                    <h2>${mensagens[i].text}</h2>
                </li>`;
                break;
            case "private-message":
                listaMensagens.innerHTML += `
                <li class="caixa-msg privado">
                    <span class="horario">${mensagens[i].time}</span>
                    <h1>${mensagens[i].from}</h1>
                    <h2>${mensagens[i].text}</h2>
                </li>`;
                break;
        }

        
    }
}

function horarioAtual() {
    const horario = new Date();
    const hora = horario.getHours();
    const minuto = horario.getMinutes();
    const segundo = horario.getSeconds();
    console.log(`${hora}:${minuto}:${segundo}`);
}

function enviarMensagem() {
const mensagem = document.querySelector(".barra-msg input").value;
console.log(mensagem);
document.querySelector(".barra-msg input").value = "";
}