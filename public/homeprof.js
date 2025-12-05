const user = JSON.parse(localStorage.getItem('usuario'));

window.onload = () => {
    listarTurma();
    listarQuizzes();
};

function vaiproinicio(){
    if (user.tipo === 'aluno'){
        window.location.href = 'homealuno.html'
    }
    if (user.tipo === 'prof'){
        window.location.href = 'homeprof.html'
    }
}


//CARROSSEL HOMEPAGE
let currentIndex1 = 0;
let currentIndex2 = 0;

function moveSlide1(step) {
  const viewport = document.querySelector('#seccarrossel1');
  const track    = document.querySelector('#secroladora1');
  const slides   = document.querySelectorAll('.divenv');
  if (!viewport || !track || slides.length === 0) return;

  const cardWidth   = slides[0].offsetWidth;
  const gap         = parseInt(getComputedStyle(track).gap) || 0;
  const unit        = cardWidth + gap;
  const visible     = Math.max(1, Math.floor(viewport.offsetWidth / unit));
  const maxIndex    = slides.length - visible;

  currentIndex1 = Math.min(Math.max(0, currentIndex1 + step), maxIndex);
  track.style.transform = `translateX(-${currentIndex1 * unit}px)`;
}

function moveSlide2(step) {
  const viewport = document.querySelector('#seccarrossel2');
  const track    = document.querySelector('#secroladora2');
  const slides   = document.querySelectorAll('.divenc');
  if (!viewport || !track || slides.length === 0) return;

  const cardWidth   = slides[0].offsetWidth;
  const gap         = parseInt(getComputedStyle(track).gap) || 0;
  const unit        = cardWidth + gap;
  const visible     = Math.max(1, Math.floor(viewport.offsetWidth / unit));
  const maxIndex    = slides.length - visible;

  currentIndex2 = Math.min(Math.max(0, currentIndex2 + step), maxIndex);
  track.style.transform = `translateX(-${currentIndex2 * unit}px)`;
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

async function listarQuizzes() {
    const pr_id = user.id;

    const res = await fetch(`/quiz/prof/${pr_id}`);
    const quizzes = await res.json();

    const enviadas   = document.getElementById("secroladora1");
    const encerradas = document.getElementById("secroladora2");

    enviadas.innerHTML = "";
    encerradas.innerHTML = "";

    // Separar quizzes enviados e encerrados
    const enviadasLista = quizzes.filter(q => new Date(q.qz_prazo) > new Date());
    const encerradasLista = quizzes.filter(q => new Date(q.qz_prazo) <= new Date());

    // ---------------------------
    //   QUIZZES ENVIADOS
    // ---------------------------
    if (enviadasLista.length === 0) {
        enviadas.innerHTML = "<p>Nenhuma atividade enviada.</p>";
    } else {
        enviadasLista.forEach(qz => {
            const div = document.createElement("button");
            div.className = "divenv";
            div.innerText = qz.qz_nome;
            enviadas.appendChild(div);
        });
    }

    // ---------------------------
    //   QUIZZES ENCERRADOS
    // ---------------------------
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
}
