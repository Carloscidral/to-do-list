let tarefa = document.getElementById('tarefa');
let adicionar = document.getElementById('adicionar');
let lista = document.getElementById('lista');

// abre/fecha menu
document.getElementById("menubtn").onclick = () => {
    document.querySelector("body").classList.toggle("menuOpen");
};

// evento de adicionar tarefa
adicionar.addEventListener('click', function() {
    const texto = tarefa.value.trim();
    if (!texto) return alert("Digite uma tarefa!");

    let item = document.createElement('li');

    // texto da tarefa
    let span = document.createElement('span');
    span.textContent = texto;

    // contêiner de botões
    let acoes = document.createElement('div');
    acoes.classList.add('acoes');

    // botão editar
    let botaoEditar = document.createElement('button');
    botaoEditar.innerHTML = '<img src="img/botao-editar.png" alt="Editar">';
    botaoEditar.title = "Editar";
    botaoEditar.addEventListener('click', () => {
        editarTarefa(span, botaoEditar, item, acoes);
    });
    acoes.appendChild(botaoEditar);

    // botão excluir
    let botaoExcluir = document.createElement('button');
    botaoExcluir.innerHTML = '<img src="img/lixeira-de-reciclagem.png" alt="Excluir">';
    botaoExcluir.title = "Excluir";
    botaoExcluir.addEventListener('click', () => {
        lista.removeChild(item);
    });
    acoes.appendChild(botaoExcluir);

    // adiciona tudo no item
    item.appendChild(span);
    item.appendChild(acoes);
    lista.appendChild(item);

    // limpa input
    tarefa.value = '';
});

// função de edição
function editarTarefa(span, botaoEditar, item, acoes) {
    let input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.style.flex = '1';

    item.insertBefore(input, span);
    span.style.display = 'none';
    botaoEditar.style.display = 'none';

    // botão salvar
    let botaoSalvar = document.createElement('button');
    botaoSalvar.innerHTML = '<img src="img/salvar.png" alt="Salvar">';
    botaoSalvar.title = 'Salvar';
    botaoSalvar.addEventListener('click', () => {
        if (input.value.trim() === '') return alert('Por favor, preencha esse local.');
        span.textContent = input.value;
        finalizarEdit();
    });

    // botão cancelar
    let botaoCancelar = document.createElement('button');
    botaoCancelar.innerHTML = '<img src="img/cancelar.png" alt="Cancelar">';
    botaoCancelar.title = 'Cancelar';
    botaoCancelar.addEventListener('click', finalizarEdit);

    // adiciona no mesmo contêiner
    acoes.appendChild(botaoSalvar);
    acoes.appendChild(botaoCancelar);

    function finalizarEdit() {
        input.remove();
        botaoSalvar.remove();
        botaoCancelar.remove();
        span.style.display = '';
        botaoEditar.style.display = '';
    }
}

let nomeLista = document.getElementById('nomeLista');
let adicionarLista = document.getElementById('adicionarLista');
let outrasListas = document.getElementById('outras-listas');

adicionarLista.addEventListener('click', function() {
    const texto = nomeLista.value.trim();
    if (!texto) return alert("Digite o nome da lista!");

    let item = document.createElement('li');
    item.textContent = texto;

    let botaoExcluir = document.createElement('button');
    botaoExcluir.innerHTML = '<img src="img/lixeira-de-reciclagem.png" alt="Excluir">'
    botaoExcluir.style.marginLeft = "10px";
    botaoExcluir.style.cursor = "pointer";
    botaoExcluir.addEventListener('click', () => {
        outrasListas.removeChild(item);
    });

    item.appendChild(botaoExcluir);
    outrasListas.appendChild(item);

    nomeLista.value = '';
});
