const user = JSON.parse(localStorage.getItem('usuario'));

/*
if (user) {
    const spacenome = document.getElementById('teunome');
    const spaceid = document.getElementById('teuid');
    
    spacenome.textContent = user.nome;
    spaceid.textContent = user.id;
}
*/

function vaiproinicio(){
    if (user.tipo === 'aluno'){
        window.location.href = 'homealuno.html'
    }
    if (user.tipo === 'prof'){
        window.location.href = 'homeprof.html'
    }
}

async function cadastrarTurma(event) {
    event.preventDefault();
    /*
    const tu_id = document.getElementById("id").value;

    if(tu_id){
        alert("O ID é atribuído automaticamente, sendo utilizado apenas para atualização.");
    }
    */

    const turma = {
        tu_nome: document.getElementById("inputnome").value,
        tu_desc: document.getElementById("inputdesc").value,
        tu_pr_id: user.id
    };

    try {
        const response = await fetch('/turma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(turma)
        });

        const result = await response.json();
        if (response.ok) {
            alert("cadastrado com sucesso!");
            document.getElementById("secmain").reset();
            listarTurma(); // atualiza lista automaticamente
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar turma.");
    }
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

// Função para atualizar as informações da turma
async function atualizarTurma() {
    const tu_id = document.getElementById('id').value;
    const tu_nome = document.getElementById('nome').value;
    const tu_desc = document.getElementById('desc').value;
    const tu_prid = document.getElementById('prid').value;

    const turmaAtualizado = {
        tu_nome,
        tu_desc
    };

    if(tu_prid){
        alert('Não é possível alterar o id do professor que criou a turma.');
    }

    if(tu_id){
        try {
            const response = await fetch(`/turma/tu_id/${tu_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(turmaAtualizado)
            });

            if (response.ok) {
                alert('Turma atualizada com sucesso!');
                listarTurma(); // atualiza lista automaticamente
            } else {
                const errorMessage = await response.text();
                alert('Erro ao atualizar turma: ' + errorMessage);
            }
        } catch (error) {
            console.error('Erro ao atualizar turma:', error);
            alert('Erro ao atualizar turma.');
        }
    }else{
        alert('ID é um campo necessário para atualização.');
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