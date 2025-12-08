const user = JSON.parse(localStorage.getItem('usuario'));

window.onload = () => {
    listarTurma();
    listarQuizzes();
};

function vaiproinicio() {
    if (user.tipo === 'aluno') {
        window.location.href = 'homealuno.html';
    }
    if (user.tipo === 'prof') {
        window.location.href = 'homeprof.html';
    }
}

// ================================
//        CARROSSEL
// ================================
let currentIndex1 = 0;
let currentIndex2 = 0;

function moveSlide1(step) {
    const viewport = document.querySelector('#seccarrossel1');
    const track = document.querySelector('#secroladora1');
    const slides = document.querySelectorAll('.divenv');
    if (!viewport || !track || slides.length === 0) return;

    const cardWidth = slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const unit = cardWidth + gap;
    const visible = Math.max(1, Math.floor(viewport.offsetWidth / unit));
    const maxIndex = slides.length - visible;

    currentIndex1 = Math.min(Math.max(0, currentIndex1 + step), maxIndex);
    track.style.transform = `translateX(-${currentIndex1 * unit}px)`;
}

function moveSlide2(step) {
    const viewport = document.querySelector('#seccarrossel2');
    const track = document.querySelector('#secroladora2');
    const slides = document.querySelectorAll('.divenc');
    if (!viewport || !track || slides.length === 0) return;

    const cardWidth = slides[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const unit = cardWidth + gap;
    const visible = Math.max(1, Math.floor(viewport.offsetWidth / unit));
    const maxIndex = slides.length - visible;

    currentIndex2 = Math.min(Math.max(0, currentIndex2 + step), maxIndex);
    track.style.transform = `translateX(-${currentIndex2 * unit}px)`;
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

// ================================
//     LISTAR QUIZZES
// ================================
async function listarQuizzes() {
    const enviadas = document.getElementById("secroladora1");
    const encerradas = document.getElementById("secroladora2");
    enviadas.innerHTML = "";
    encerradas.innerHTML = "";

    try {
        let quizzes = [];
        const turmaSelecionada = JSON.parse(localStorage.getItem("turma"));

        if (turmaSelecionada && turmaSelecionada.id) {
            const res = await fetch(`/turma/${turmaSelecionada.id}/quizzes`);
            quizzes = await res.json();
        } else {
            const turmas = await fetch(`/aluno/${user.id}/turmas`).then(r => r.json());

            for (const turma of turmas) {
                const r = await fetch(`/turma/${turma.tu_id}/quizzes`);
                const qzs = await r.json();
                quizzes.push(...qzs);
            }

            quizzes = quizzes.filter(
                (q, i, arr) => i === arr.findIndex(x => x.qz_id === q.qz_id)
            );
        }

        const agora = new Date();
        const enviadasLista = quizzes.filter(q => new Date(q.qz_prazo) > agora);
        const encerradasLista = quizzes.filter(q => new Date(q.qz_prazo) <= agora);

        if (enviadasLista.length === 0) {
            enviadas.innerHTML = "<p>Nenhuma atividade pendente.</p>";
        } else {
            enviadasLista.forEach(qz => {
                const div = document.createElement("button");
                div.className = "divenv";
                div.innerText = qz.qz_nome;
                enviadas.appendChild(div);
            });
        }

        if (encerradasLista.length === 0) {
            encerradas.innerHTML = "<p>Nenhuma atividade encerrada.</p>";
        } else {
            encerradasLista.forEach(qz => {
                const div = document.createElement("button");
                div.className = "divenc";
                div.innerText = qz.qz_nome;
                encerradas.appendChild(div);
            });
        }

    } catch (e) {
        console.error("Erro ao listar quizzes:", e);
    }
}

// ================================
//        MODAL TURMA
// ================================
function abrirModal() {
    document.getElementById("modal").style.display = "flex";
}

document.getElementById("btnFecharModal").onclick = function () {
    document.getElementById("modal").style.display = "none";
};

// ================================
//    ENTRAR EM TURMA
// ================================
document.getElementById("btnEntrarTurma").onclick = async function () {
    const turmaId = document.getElementById("inputTurmaId").value.trim();

    if (!turmaId) {
        alert("Digite um ID de turma!");
        return;
    }

    try {
        const res = await fetch(`/turma/${turmaId}/addAluno`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ al_id: user.id })
        });

        if (!res.ok) {
            alert("Erro ao entrar na turma.");
            return;
        }

        alert("Você entrou na turma com sucesso!");
        listarTurma();
        document.getElementById("modal").style.display = "none";
    }
    catch (e) {
        console.error(e);
        alert("Erro ao entrar na turma.");
    }
};

// ================================
//        MODAL QUIZ
// ================================
function abrirModalQuiz() {
    document.getElementById("modalQuiz").style.display = "flex";
}

document.getElementById("btnFecharModalQuiz").onclick = function () {
    document.getElementById("modalQuiz").style.display = "none";
};

// =====================
