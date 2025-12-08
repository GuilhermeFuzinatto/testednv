function verSenhaAluno() {
    const inputao = document.getElementById('alsenha');
    const divzao = document.getElementById('aldivsenha');
    const imagizona = document.getElementById('alzoi');
    if (inputao.type === 'password') {
        inputao.type = 'text';
        divzao.style.backgroundColor = '#ffda33';
        imagizona.src = 'imagens/vesim.png';
    } else {
        inputao.type = 'password';
        divzao.style.backgroundColor = '#e4e4e4';
        imagizona.src = 'imagens/venao.png';
    }
}

function verSenhaProf() {
    const inputao = document.getElementById('prsenha');
    const divzao = document.getElementById('prdivsenha');
    const imagizona = document.getElementById('przoi');
    if (inputao.type === 'password') {
        inputao.type = 'text';
        divzao.style.backgroundColor = '#ffda33';
        imagizona.src = 'imagens/vesim.png';
    } else {
        inputao.type = 'password';
        divzao.style.backgroundColor = '#e4e4e4';
        imagizona.src = 'imagens/venao.png';
    }
}

//Cadastrar Aluno
async function cadastrarAluno(event) {
    event.preventDefault();

    const aluno = {
        email: document.getElementById("alemail").value,
        nome: document.getElementById("alnome").value,
        senha: document.getElementById("alsenha").value
    };

    try {
        const response = await fetch('/aluno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });

        const result = await response.json();
        if (response.ok) {
            alert("cadastrado com sucesso!");
            document.getElementById("alform").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar aluno.");
    }
}

// Função para listar todos os alunos, oq era sobre buscar foi comentado
async function listarAluno() {
    /*
    const email = document.getElementById('email').value.trim();  // Pega o valor do email digitado no input

    if (email) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?email=${email}`;
    }
    */

    let url = '/aluno';  // URL padrão para todos os clientes

    try {
        const response = await fetch(url);
        const aluno = await response.json();

        const tabela = document.getElementById('tabelaaluno');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (aluno.length === 0) {
            // Caso não encontre cadastros, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="2">Nenhum cadastro encontrado.</td></tr>';
        } else {
            aluno.forEach(aluno => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${aluno.al_id}</td>
                    <td>${aluno.al_email}</td>
                    <td>${aluno.al_nome}</td>
                    <td>${aluno.al_senha}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar cadastros:', error);
    }
}

// Função para atualizar as informações do aluno
async function atualizarAluno() {
    const nome = document.getElementById('al_nome').value;
    const email = document.getElementById('al_email').value;
    const senha = document.getElementById('al_senha').value;

    const alunoAtualizado = {
        nome,
        email,
        senha
    };

    try {
        const response = await fetch(`/aluno/email/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(alunoAtualizado)
        });

        if (response.ok) {
            alert('Aluno atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar aluno: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        alert('Erro ao atualizar aluno.');
    }
}

//Cadastrar Prof
async function cadastrarProf(event) {
    event.preventDefault();

    const prof = {
        email: document.getElementById("premail").value,
        nome: document.getElementById("prnome").value,
        senha: document.getElementById("prsenha").value
    };

    try {
        const response = await fetch('/prof', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prof)
        });

        const result = await response.json();
        if (response.ok) {
            alert("cadastrado com sucesso!");
            document.getElementById("prform").reset();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar professor.");
    }
}

// Função para listar todos os professores, oq era sobre buscar foi comentado
async function listarProf() {
    /*
    const email = document.getElementById('email').value.trim();  // Pega o valor do email digitado no input

    if (email) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?email=${email}`;
    }
    */

    let url = '/prof';  // URL padrão para todos os clientes

    try {
        const response = await fetch(url);
        const prof = await response.json();

        const tabela = document.getElementById('tabelaprof');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (prof.length === 0) {
            // Caso não encontre cadastros, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="2">Nenhum cadastro encontrado.</td></tr>';
        } else {
            prof.forEach(prof => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${prof.pr_id}</td>
                    <td>${prof.pr_email}</td>
                    <td>${prof.pr_nome}</td>
                    <td>${prof.pr_senha}</td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar cadastros:', error);
    }
}

// Função para atualizar as informações do professor
async function atualizarProf() {
    const nome = document.getElementById('pr_nome').value;
    const email = document.getElementById('pr_email').value;
    const senha = document.getElementById('pr_senha').value;

    const profAtualizado = {
        nome,
        email,
        senha
    };

    try {
        const response = await fetch(`/prof/email/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profAtualizado)
        });

        if (response.ok) {
            alert('Professor atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar professor: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar professor:', error);
        alert('Erro ao atualizar professor.');
    }
}