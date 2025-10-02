let tarefa = document.getElementById('tarefa');
let adicionar = document.getElementById('adicionar');
let lista = document.getElementById('lista');

const menuBtn = document.getElementById('menubtn');
menuBtn.onclick = () => {
    document.body.classList.toggle("menuOpen");
};

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('tema-escuro', themeToggle.checked);
});

let nomeLista = document.getElementById('nomeLista');
let adicionarLista = document.getElementById('adicionarLista');
let outrasListas = document.getElementById('outras-listas');
let listaTarefas = document.getElementById('lista');

let listas = JSON.parse(localStorage.getItem('listas')) || {};
let listaAtual = localStorage.getItem('listaAtual') || null;

// Atualiza localStorage
function salvar() {
    localStorage.setItem('listas', JSON.stringify(listas));
    localStorage.setItem('listaAtual', listaAtual);
}

function atualizarCarrossel() {
    let itensCarrossel = document.getElementById('itens-carrossel');
    itensCarrossel.innerHTML = '';

    const nomesListas = Object.keys(listas);

    // Duplica os itens para o efeito de rolagem infinito
    for (let i = 0; i < 2; i++) {
        nomesListas.forEach(nome => {
            let item = document.createElement('div');
            item.classList.add('carrossel-item');
            item.textContent = nome;
            // Clicar no item do carrossel seleciona a lista
            item.addEventListener('click', () => selecionarLista(nome));
            itensCarrossel.appendChild(item);
        });
    }
}

// Seleciona lista
function selecionarLista(nome) {
    listaAtual = nome;
    atualizarTarefas();
    salvar();
}

// Atualiza painel de tarefas
function atualizarTarefas() {
    listaTarefas.innerHTML = '';
    document.querySelector('.postit h2').textContent = listaAtual ? listaAtual : 'Organize seu dia';
    if (!listaAtual) return;

    listas[listaAtual].forEach((texto, index) => {
        let item = document.createElement('li');
        let span = document.createElement('span');
        span.textContent = texto;
        let acoes = document.createElement('div');
        acoes.classList.add('acoes');

        // Editar tarefa
        let botaoEditar = document.createElement('button');
        botaoEditar.innerHTML = '<img src="img/botao-editar.png" alt="Editar">';
        botaoEditar.title = "Editar";
        botaoEditar.addEventListener('click', () => editarTarefa(span, botaoEditar, acoes, index));
        acoes.appendChild(botaoEditar);

        // Excluir tarefa
        let botaoExcluir = document.createElement('button');
        botaoExcluir.innerHTML = '<img src="img/lixeira-de-reciclagem.png" alt="Excluir">';
        botaoExcluir.title = "Excluir";
        botaoExcluir.addEventListener('click', () => {
            listas[listaAtual].splice(index, 1);
            atualizarTarefas();
            salvar();
        });
        acoes.appendChild(botaoExcluir);
        item.appendChild(span);
        item.appendChild(acoes);
        listaTarefas.appendChild(item);
    });
}

// Editar tarefa
function editarTarefa(span, botaoEditar, acoes, index) {
    let input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    span.style.display = 'none';
    botaoEditar.style.display = 'none';
    span.parentNode.insertBefore(input, span);
    let botaoSalvar = document.createElement('button');
    botaoSalvar.innerHTML = '<img src="img/salvar.png" alt="salvar">';
    botaoSalvar.addEventListener('click', () => {
        if (input.value.trim() === '') return alert("Digite uma tarefa!");
        listas[listaAtual][index] = input.value.trim();
        atualizarTarefas();
        salvar();
    });
    let botaoCancelar = document.createElement('button');
    botaoCancelar.innerHTML = '<img src="img/cancelar.png" alt="cancelar">';
    botaoCancelar.addEventListener('click', () => {
        input.remove();
        botaoSalvar.remove();
        botaoCancelar.remove();
        span.style.display = '';
        botaoEditar.style.display = '';
    });
    acoes.appendChild(botaoSalvar);
    acoes.appendChild(botaoCancelar);
}

// Adicionar tarefa
adicionar.addEventListener('click', function () {
    if (!listaAtual) return alert("Selecione ou crie uma lista primeiro!");
    const texto = tarefa.value.trim();
    if (!texto) return alert("Digite uma tarefa!");
    listas[listaAtual].push(texto);
    tarefa.value = '';
    atualizarTarefas();
    salvar();
});

// Enter para adicionar tarefa
tarefa.addEventListener('keydown', e => {
    if (e.key === 'Enter') adicionar.click();
});

// Adicionar lista
adicionarLista.addEventListener('click', () => {
    const texto = nomeLista.value.trim();
    if (!texto) return alert("Digite o nome da lista!");
    if (listas[texto]) return alert("Essa lista já existe!");
    listas[texto] = [];
    listaAtual = texto;
    nomeLista.value = '';
    atualizarListasLaterais();
    atualizarTarefas();
    atualizarCarrossel();
    salvar();
});

// Pressionar Enter para adicionar lista
nomeLista.addEventListener('keydown', e => {
    if (e.key === 'Enter') adicionarLista.click();
});

// Atualiza a lateral de listas
function atualizarListasLaterais() {
    outrasListas.innerHTML = '';
    for (let nome in listas) {
        let item = document.createElement('li');
        let span = document.createElement('span');
        span.textContent = nome;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => selecionarLista(nome));
        let acoes = document.createElement('div');
        acoes.classList.add('acoes');

        let botaoEditar = document.createElement('button');
        botaoEditar.innerHTML = '<img src="img/botao-editar.png" alt="Editar">';
        botaoEditar.title = "Editar";
        botaoEditar.addEventListener('click', () => editarLista(span, botaoEditar, item, acoes, nome));
        acoes.appendChild(botaoEditar);

        let botaoExcluir = document.createElement('button');
        botaoExcluir.innerHTML = '<img src="img/lixeira-de-reciclagem.png" alt="Excluir">';
        botaoExcluir.title = "Excluir";
        botaoExcluir.addEventListener('click', () => {
            delete listas[nome];
            if (listaAtual === nome) listaAtual = null;
            atualizarListasLaterais();
            atualizarTarefas();
            atualizarCarrossel();
            salvar();
        });
        acoes.appendChild(botaoExcluir);
        item.appendChild(span);
        item.appendChild(acoes);
        outrasListas.appendChild(item);
    }
}

// Editar lista
function editarLista(span, botaoEditar, item, acoes, nomeAntigo) {
    let input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    span.style.display = 'none';
    botaoEditar.style.display = 'none';
    item.insertBefore(input, span);

    let botaoSalvar = document.createElement('button');
    botaoSalvar.innerHTML = '<img src="img/salvar.png" alt="salvar">';
    botaoSalvar.addEventListener('click', () => {
        if (input.value.trim() === '') return alert("Digite um nome para a lista!");
        let novoNome = input.value.trim();
        listas[novoNome] = listas[nomeAntigo];
        delete listas[nomeAntigo];
        if (listaAtual === nomeAntigo) listaAtual = novoNome;
        atualizarListasLaterais();
        atualizarTarefas();
        atualizarCarrossel();
        salvar();
    });
    let botaoCancelar = document.createElement('button');
    botaoCancelar.innerHTML = '<img src="img/cancelar.png" alt="cancelar">';
    botaoCancelar.addEventListener('click', () => {
        input.remove();
        botaoSalvar.remove();
        botaoCancelar.remove();
        span.style.display = '';
        botaoEditar.style.display = '';
    });
    acoes.appendChild(botaoSalvar);
    acoes.appendChild(botaoCancelar);
}

// Inicializa listas ao carregar
atualizarListasLaterais();
atualizarTarefas();
atualizarCarrossel();