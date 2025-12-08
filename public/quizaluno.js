const user = JSON.parse(localStorage.getItem("usuario"));
const quiz = JSON.parse(localStorage.getItem("quiz")); // dados do quiz selecionado

let perguntas = [];
let indexAtual = 0;
let respostasAluno = {}; // chave: pe_numero -> valor: numero ou array
let re_id = null; // id da tentativa no backend

const quizTitulo = document.getElementById("quizTitulo");
const questionContainer = document.getElementById("question-container");

// ================================
// CARREGAR QUIZ
// ================================
async function carregarQuiz() {
    quizTitulo.textContent = "Carregando...";

    try {
        // Buscar perguntas completas
        const res = await fetch(`/quiz/${quiz.id}/completo`);
        const data = await res.json();
        perguntas = data.perguntas || [];

        if (perguntas.length === 0) {
            quizTitulo.textContent = "Nenhuma pergunta encontrada.";
            return;
        }

        // Criar tentativa no backend
        const resInit = await fetch('/quiz/iniciar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ al_id: user.id, qz_id: quiz.id })
        });

        const initData = await resInit.json();
        re_id = initData.re_id;

        indexAtual = 0;
        respostasAluno = {};

        quizTitulo.textContent = quiz.nome;
        mostrarQuestao();

    } catch (error) {
        quizTitulo.textContent = "Erro ao carregar o quiz.";
        console.error(error);
    }
}

// ================================
// EXIBIR QUESTÃO
// ================================
function mostrarQuestao() {
    const q = perguntas[indexAtual];

    const tipo = Number(q.pe_tipo);
    const enunciado = q.pe_enunciado ?? "Sem enunciado";

    let labelTipo = "";
    if (tipo === 1) labelTipo = " (Única correta)";
    if (tipo === 2) labelTipo = " (Múltipla escolha)";
    if (tipo === 3) labelTipo = " (Verdadeiro ou Falso)";

    quizTitulo.textContent =
        `${quiz.nome} — Questão ${indexAtual + 1} de ${perguntas.length}${labelTipo}`;

    questionContainer.innerHTML = "";

    const perguntaTexto = document.createElement("p");
    perguntaTexto.textContent = enunciado;
    questionContainer.appendChild(perguntaTexto);

    const altDiv = document.createElement("div");
    altDiv.classList.add("alternativas-container");

    // ======================
    // TIPO 3 — VERDADEIRO/FALSO
    // ======================
    if (tipo === 3) {
        q.alternativas.forEach(alt => {
            const linha = document.createElement("div");
            linha.classList.add("alternativa-linha");

            const texto = document.createElement("span");
            texto.textContent = alt.av_texto;

            const select = document.createElement("select");
            select.className = "selectVF";
            select.innerHTML = `
                <option value="">Selecione</option>
                <option value="V">V</option>
                <option value="F">F</option>
            `;

            // restaurar seleções
            const resp = respostasAluno[q.pe_numero];
            if (resp && resp[alt.av_numero]) {
                select.value = resp[alt.av_numero];
            }

            select.onchange = () => {
                if (!respostasAluno[q.pe_numero]) respostasAluno[q.pe_numero] = {};
                respostasAluno[q.pe_numero][alt.av_numero] = select.value;
            };

            linha.appendChild(texto);
            linha.appendChild(select);
            altDiv.appendChild(linha);
        });

        questionContainer.appendChild(altDiv);
        atualizarBotoes();
        return;
    }

    // ======================
    // TIPOS 1 e 2 — alternativas normais
    // ======================
    const permiteMultipla = tipo === 2;

    q.alternativas.forEach(alt => {
        const btn = document.createElement("div");
        btn.classList.add("alternativa");
        btn.textContent = alt.av_texto;

        // Seleção visual
        const resp = respostasAluno[q.pe_numero];
        let selecionado = false;

        if (Array.isArray(resp)) selecionado = resp.includes(alt.av_numero);
        else if (resp) selecionado = resp === alt.av_numero;

        if (selecionado) btn.classList.add("selecionada");

        btn.onclick = () => {
            if (permiteMultipla) {
                if (!Array.isArray(respostasAluno[q.pe_numero]))
                    respostasAluno[q.pe_numero] = [];

                const arr = respostasAluno[q.pe_numero];
                const idx = arr.indexOf(alt.av_numero);

                if (idx === -1) arr.push(alt.av_numero);
                else arr.splice(idx, 1);
            } else {
                respostasAluno[q.pe_numero] = alt.av_numero;
            }
            mostrarQuestao();
        };

        altDiv.appendChild(btn);
    });

    questionContainer.appendChild(altDiv);
    atualizarBotoes();
}

// ================================
// BOTÕES DE NAVEGAÇÃO
// ================================
function atualizarBotoes() {
    document.getElementById("btnPrev").style.display =
        indexAtual === 0 ? "none" : "inline-block";

    document.getElementById("btnNext").style.display =
        indexAtual === perguntas.length - 1 ? "none" : "inline-block";

    document.getElementById("btnFinish").style.display =
        indexAtual === perguntas.length - 1 ? "inline-block" : "none";
}

document.getElementById("btnPrev").onclick = () => {
    if (indexAtual > 0) {
        indexAtual--;
        mostrarQuestao();
    }
};

document.getElementById("btnNext").onclick = () => {
    if (indexAtual < perguntas.length - 1) {
        indexAtual++;
        mostrarQuestao();
    }
};

// ================================
// FINALIZAR QUIZ
// ================================
document.getElementById("btnFinish").onclick = async () => {
    const respostasArray = [];

    Object.keys(respostasAluno).forEach(pe => {
        const val = respostasAluno[pe];
        if (Array.isArray(val)) {
            val.forEach(av =>
                respostasArray.push({ pe_numero: Number(pe), av_numero: av })
            );
        } else {
            respostasArray.push({ pe_numero: Number(pe), av_numero: val });
        }
    });

    try {
        const res = await fetch("/quiz/finalizar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ re_id, respostas: respostasArray })
        });

        const resultado = await res.json();

        alert(`Você acertou ${resultado.certas} questões! Nota: ${resultado.nota}`);

        // ===================================
        // SALVAR QUIZ FINALIZADO NA HOME
        // ===================================
        localStorage.setItem("quizFinalizado", JSON.stringify({
            qz_id: quiz.id,
            nome: quiz.nome,
            data: new Date().toISOString()
        }));

        // volta para a home
        window.location.href = "homealuno.html";

    } catch (err) {
        console.error(err);
        alert("Erro ao enviar respostas. Tente novamente.");
    }
};

// Inicia tudo
carregarQuiz();
