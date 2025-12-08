const user = JSON.parse(localStorage.getItem('usuario'));

if (user) {
    const spacenome = document.getElementById('teunome');
    const spaceid = document.getElementById('teuid');
    
    spacenome.textContent = user.nome;
    spaceid.textContent = "#" + user.id;
} 

function vaiproinicio(){
    if (user.tipo === 'aluno'){
        window.location.href = 'homealuno.html'
    }
    if (user.tipo === 'prof'){
        window.location.href = 'homeprof.html'
    }
}

function tuntuntunsair(){
    window.location.href = 'login.html'
}

// Função para listar as turmas
async function listarTurma() {
    
    let url = '/turma';  // URL padrão para todos os clientes

    try {
        const response = await fetch(url);
        const turma = await response.json();

        const sec = document.getElementById('subsecturmas');
        sec.innerHTML = ''; // Limpa a tabela antes de preencher

        if (turma.length === 0) {
            // Caso não encontre cadastros, exibe uma mensagem
            sec.innerHTML = '<div class="divtur">n tem turma<div>';
        } else {
            turma.forEach(turma => {
                /*sec.innerHTML = `
                    <td>${turma.email}</td>
                    <td>${turma.senha}</td>
                `;
                */
                sec.innerHTML += `
                    <button class="divtur" onclick="selecTurma(${turma.tu_id}, '${turma.tu_nome}', '${turma.tu_desc}', ${turma.tu_pr_id})">${turma.tu_nome}</button>
                `
            });
        }
    } catch (error) {
        console.error('Erro ao listar cadastros:', error);
    }
}

function selecTurma(id, nome, desc, prid){
    const dadosTurma = {
        tipo: 'turma',
        id: id,
        nome: nome,
        desc: desc,
        prid: prid
    };

    localStorage.setItem('turma', JSON.stringify(dadosTurma));

    if(user.tipo === 'aluno'){
        window.location.href = 'turmaaluno.html';
    }else if(user.tipo === 'prof'){
        window.location.href = 'turmaprof.html';
    }
    
}