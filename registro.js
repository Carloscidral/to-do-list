// Navbar e tema
const menuBtn = document.getElementById('menubtn');
menuBtn.onclick = () => document.body.classList.toggle("menuOpen");

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('tema-escuro', themeToggle.checked);
});

// Registro de usuários
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const registrarBtn = document.getElementById('registrar');
const listaUsuarios = document.getElementById('listaUsuarios');

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function atualizarLista() {
    listaUsuarios.innerHTML = '';
    usuarios.forEach((usuario, index) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = usuario.nome + ' - ' + usuario.email;

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('excluir');

        // Adicione a imagem da lixeira
        const imgLixeira = document.createElement('img');
        imgLixeira.src = 'img/lixeira-de-reciclagem.png';
        imgLixeira.alt = 'Excluir';
        imgLixeira.style.width = '16px';
        imgLixeira.style.height = '16px';
        btnExcluir.appendChild(imgLixeira);

        btnExcluir.title = 'Excluir';
        btnExcluir.addEventListener('click', () => {
            usuarios.splice(index, 1);
            atualizarLista();
            salvarUsuarios();
        });

        li.appendChild(span);
        li.appendChild(btnExcluir); // <- adiciona o botão ao li
        listaUsuarios.appendChild(li);
    });
}

// Registrar usuário
registrarBtn.addEventListener('click', () => {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const confirmar = confirmarSenhaInput.value;

    if (!nome || !email || !senha || !confirmar) return alert('Preencha todos os campos!');
    if (senha !== confirmar) return alert('As senhas não conferem!');

    usuarios.push({ nome, email, senha });
    nomeInput.value = '';
    emailInput.value = '';
    senhaInput.value = '';
    confirmarSenhaInput.value = '';

    atualizarLista();
    salvarUsuarios();
});

// Inicializa
atualizarLista();
