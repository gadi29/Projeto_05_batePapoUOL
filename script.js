let usuario = {name: ""};
let contatos = [{name: ""}];
let mensagens = [{from:"", to:"", text:"", type:"", time:""}];
let enviarPara;
let visibilidadeType;
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
    pegarContatos();

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
            case "private_message":
                if ((mensagens[i].to || mensagens[i].from) === usuario.name) {
                    listaMensagens.innerHTML += `
                <li class="caixa-msg ${mensagens[i].type}">
                    <h1>
                    <span class="horario">${mensagens[i].time}</span> <strong>${mensagens[i].from}</strong> reservadamente para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}
                    </h1>
                </li>`;
                }
                break;
        };
    }
    
    const ultimaMensagem = document.querySelector(".lista-mensagens li:last-of-type");
    ultimaMensagem.scrollIntoView();

    const imagemContato = document.querySelector(".contato-selecionado");
    const liSelecionada = imagemContato.parentNode.querySelector("span");
    enviarPara = liSelecionada.innerHTML;

    const imagemVisib = document.querySelector(".visib-selecionada");
    const visibSelecionada = imagemVisib.parentNode.querySelector("span");
    let visibilidadeEnvio = visibSelecionada.innerHTML;

    const textoDescricao = document.querySelector(".mensagem-descricao").querySelector("h3");
    textoDescricao.innerHTML = `Enviando para ${enviarPara} (${visibilidadeEnvio})`;

    if (visibilidadeEnvio === "Reservadamente") {
        visibilidadeType = "private_message";
    } else if (visibilidadeEnvio === "Público") {
        visibilidadeType = "message";
    }
    console.log(visibilidadeType);
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
    <li onclick="escolherContato(this)">
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
        <img src="img/Vector.png" alt="" class="contato-selecionado">
    </li>`;

    for (let i=0; i<contatos.length; i++) {

        if (contatos[i].name !== usuario.name) {
            listaContatos.innerHTML += `
            <li onclick="escolherContato(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span>${contatos[i].name}</span>
            </li>`
        }
    }
}

function enviarMensagem() {

    horarioAtual();

    const textoMensagem = document.querySelector(".barra-msg input").value;
    const mensagem = {from:`${usuario.name}`, to:`${enviarPara}`, text:`${textoMensagem}`, type:`${visibilidadeType}`, time:`${agora}`}

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

function escolherContato(elemento) {

    let contatoSelecionado;
    contatoSelecionado = document.querySelector(".contato-selecionado");

    if (contatoSelecionado !== null) {
        contatoSelecionado.parentNode.removeChild(contatoSelecionado);
    }

    elemento.innerHTML += `<img src="img/Vector.png" alt="" class="contato-selecionado">`;
}

function escolherVisibilidade(elemento) {

    let visibilidade;
    visibilidade = document.querySelector(".visib-selecionada");

    if (visibilidade !== null) {
        visibilidade.parentNode.removeChild(visibilidade);
    }

    elemento.innerHTML += `<img src="img/Vector.png" alt="" class="visib-selecionada">`;
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