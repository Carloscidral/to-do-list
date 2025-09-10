let tarefa = document.getElementById('tarefa');
let adicionar = document.getElementById('adicionar');
let lista = document.getElementById('lista');
document.getElementById("menubtn").onclick = ()=> {
    document.querySelector("body").classList.toggle("menuOpen")
}

adicionar.addEventListener('click', function() {
    let item = document.createElement('li');
    item.textContent = tarefa.value

   let botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.addEventListener('click', function() {
        lista.removeChild(item);})
    
    item.appendChild(botaoExcluir);
    lista.appendChild(item);
    tarefa.value = '';
})