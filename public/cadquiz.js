const user = JSON.parse(localStorage.getItem('usuario'));

function vaiproinicio(){
    if (user.tipo === 'aluno'){
        window.location.href = 'homealuno.html'
    }
    if (user.tipo === 'prof'){
        window.location.href = 'homeprof.html'
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

// Controle do input de prazo
const input = document.getElementById("inputprazo");

// Pega a data atual no formato YYYY-MM-DDTHH:MM
const agora = new Date();
agora.setMinutes(agora.getMinutes() + 5); // Pra permitir que o prazo minimo seja daqui 5 minutos
const ano = agora.getFullYear();
const mes = String(agora.getMonth() + 1).padStart(2, '0');
const dia = String(agora.getDate()).padStart(2, '0');
const hora = String(agora.getHours()).padStart(2, '0');
const minuto = String(agora.getMinutes()).padStart(2, '0');

const dataAtual = `${ano}-${mes}-${dia}T${hora}:${minuto}`;

input.min = dataAtual;

// Função pra salvar o quiz
async function salvarQuiz() {
    const nome = document.getElementById("inputnome").value;
    const valor = document.getElementById("inputvalor").value;
    const prazo = document.getElementById("inputprazo").value;

    const res = await fetch("/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            qz_nome: nome,
            qz_valor: valor,
            qz_prazo: prazo,
            qz_pr_id: user.id
        })
    });

    const dados = await res.json();

    // guardar ID do quiz pra usar no cadquiz2
    localStorage.setItem("quiz_id", dados.id);

    // ir para a página de perguntas
    window.location.href = "cadquiz2.html";
}
