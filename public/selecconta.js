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

        const tabela = document.getElementById('secalunos');
        //tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (aluno.length === 0) {
            // Caso não encontre cadastros, exibe uma mensagem
            tabela.innerHTML = 'Nenhum aluno encontrado.';
        } else {
            aluno.forEach(aluno => {
                const div = document.createElement('div');
                div.textContent = aluno.al_nome;

                div.onclick = () => {
                    const dados = {
                        tipo: 'aluno',
                        id: aluno.al_id,
                        email: aluno.al_email,
                        nome: aluno.al_nome
                    };
                    localStorage.setItem('usuario', JSON.stringify(dados));
                    window.location.href = 'homealuno.html'; // abre o site "na conta"
                };
                
                div.style.cursor = 'pointer';

                tabela.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Erro ao listar cadastros:', error);
    }
}

// Função para listar todos os alunos, oq era sobre buscar foi comentado
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

        const tabela = document.getElementById('secprofs');
        //tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (prof.length === 0) {
            // Caso não encontre cadastros, exibe uma mensagem
            tabela.innerHTML = 'Nenhum profesor encontrado.';
        } else {
            prof.forEach(prof => {
                const div = document.createElement('div');
                div.textContent = prof.pr_nome;

                div.onclick = () => {
                    const dados = {
                        tipo: 'prof',
                        id: prof.pr_id,
                        email: prof.pr_email,
                        nome: prof.pr_nome
                    };
                    localStorage.setItem('usuario', JSON.stringify(dados));
                    window.location.href = 'homeprof.html'; // abre o site "na conta"
                };

                tabela.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Erro ao listar cadastros:', error);
    }
}