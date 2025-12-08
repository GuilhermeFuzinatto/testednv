const user = JSON.parse(localStorage.getItem('usuario'));
const turma = JSON.parse(localStorage.getItem('turma'));

function vaiproinicio(){
    if (user.tipo === 'aluno'){
        window.location.href = 'homealuno.html'
    }
    if (user.tipo === 'prof'){
        window.location.href = 'homeprof.html'
    }
}

// carregar nome da turma na tela
document.getElementById("turmanome").textContent = turma.nome;
document.getElementById("turmadesc").textContent = turma.desc;

// alternância ABA QUIZZES <-> ALUNOS
function mostrarQuizzes() {
    document.getElementById("sectionQuizzes").style.display = "block";
    document.getElementById("sectionAlunos").style.display = "none";
}

function mostrarAlunos() {
    document.getElementById("sectionQuizzes").style.display = "none";
    document.getElementById("sectionAlunos").style.display = "block";
    listarAlunos();
}

// ----------------- LISTAR QUIZZES DA TURMA ----------------
async function listarQuizzesTurma() {
    const res = await fetch(`/turma/${turma.id}/quizzes`);
    const quizzes = await res.json();

    const enviadas   = document.getElementById("track1");
    const encerradas = document.getElementById("track2");

    enviadas.innerHTML = "";
    encerradas.innerHTML = "";

    if (quizzes.length === 0) {
        enviadas.innerHTML   = "<p>Nenhuma atividade enviada.</p>";
        encerradas.innerHTML = "<p>Nenhuma atividade encerrada.</p>";
        return;
    }

    quizzes.forEach(qz => {
        const card = document.createElement("button");
        card.className = "divenv";
        card.innerText = qz.qz_nome;
        card.onclick = () => selecQuiz(qz.qz_id, qz.qz_nome, qz.qz_valor, qz.qz_prazo);

        const aindaAberto = new Date(qz.qz_prazo) > new Date();

        if (aindaAberto) {
            enviarPara(enviadas, card);
        } else {
            enviarPara(encerradas, card);
        }
    });
}

function enviarPara(destino, elemento) {
    elemento.className = "divenv";
    destino.appendChild(elemento);
}

// ----------------- LISTAR ALUNOS ----------------
async function listarAlunos() {
    const res = await fetch(`/turma/${turma.id}/alunos`);
    const alunos = await res.json();

    const lista = document.getElementById("listaAlunos");
    lista.innerHTML = "";

    if (alunos.length === 0) {
        lista.innerHTML = "<p>Nenhum aluno nesta turma.</p>";
        return;
    }

    alunos.forEach(al => {
        lista.innerHTML += `
            <div class="alunoCard">
                <strong>${al.al_nome}</strong><br>
                <small>${al.al_email}</small>
            </div>
        `;
    });
}

// ----------------- CARROSSEL ----------------
let i1 = 0, i2 = 0;

function moveSlide1(step) {
    const track = document.getElementById("track1");
    const cards = track.children;
    if (cards.length === 0) return;

    const width = cards[0].offsetWidth + 16;
    i1 += step;
    i1 = Math.max(0, Math.min(i1, cards.length - 1));
    track.style.transform = `translateX(-${i1 * width}px)`;
}

function moveSlide2(step) {
    const track = document.getElementById("track2");
    const cards = track.children;
    if (cards.length === 0) return;

    const width = cards[0].offsetWidth + 16;
    i2 += step;
    i2 = Math.max(0, Math.min(i2, cards.length - 1));
    track.style.transform = `translateX(-${i2 * width}px)`;
}

// carregar tudo
listarQuizzesTurma();

// selecionar quiz
function selecQuiz(id, nome, valor, prazo){
    const dadosQuiz = {
        id: id,
        nome: nome,
        valor: valor,
        prazo: prazo
    };

    localStorage.setItem("quiz", JSON.stringify(dadosQuiz));

    window.location.href = "quizaluno.html";
}

// ================================
//     LISTAR TURMAS
// ================================
async function listarTurma() {
    let url = `/aluno/${user.id}/turmas`;

    try {
        const response = await fetch(url);
        const turma = await response.json();

        const sec = document.getElementById('subsecturmas');
        sec.innerHTML = '';

        if (turma.length === 0) {
            sec.innerHTML = '<div class="divtur">n tem turma<div>';
        } else {
            turma.forEach(turma => {
                sec.innerHTML += `
                    <button class="divtur" onclick="selecTurma(${turma.tu_id}, '${turma.tu_nome}', '${turma.tu_desc}', ${turma.tu_pr_id})">${turma.tu_nome}</button>
                `;
            });
        }
    } catch (error) {
        console.error('Erro ao listar cadastros:', error);
    }
}

function selecTurma(id, nome, desc, prid) {
    const dadosTurma = {
        tipo: 'turma',
        id: id,
        nome: nome,
        desc: desc,
        prid: prid
    };

    localStorage.setItem('turma', JSON.stringify(dadosTurma));

    if (user.tipo === 'aluno') {
        window.location.href = 'turmaaluno.html';
    } else if (user.tipo === 'prof') {
        window.location.href = 'turmaprof.html';
    }
}