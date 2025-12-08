const user = JSON.parse(localStorage.getItem("usuario"));

// ===================== VARIÁVEIS GERAIS =====================

let questoes = {};        // armazena todas as questões
let questaoAtual = 1;     // questão que está sendo editada
let numeroPergunta = 1;   // compatível com seu código antigo

// ===================== INÍCIO DA PÁGINA =====================

window.onload = () => {
    criarQuestaoNoAside();  // cria card da Questão 1
    criarPergunta();        // cria área da Questão 1
    document.getElementById("tipo1").focus();
};

// ===================== AO SAIR DA PÁGINA =====================

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
});

// ===================== CRIAR CARD NO ASIDE =====================

function criarQuestaoNoAside() {
    const lista = document.getElementById("listaQuestoes");

    // remove botão +- caso exista, pra recolocar depois
    const botaoAntigo = document.getElementById("adicionarQuestao");
    if (botaoAntigo) botaoAntigo.remove();

    // cria card da questão atual
    const card = document.createElement("div");
    card.className = "questaoCard";
    card.innerText = "Questão " + questaoAtual;
    card.dataset.num = questaoAtual;

    card.onclick = () => {
        salvarQuestaoAtual();
        questaoAtual = parseInt(card.dataset.num);
        carregarQuestao(questaoAtual);
    };

    lista.appendChild(card);

    // cria botão de adicionar
    const botaoAdd = document.createElement("button");
    botaoAdd.id = "adicionarQuestao";
    botaoAdd.innerText = "Adicionar Questão";

    botaoAdd.onclick = () => {
        salvarQuestaoAtual();
        questaoAtual++;
        criarQuestaoNoAside();
        criarPergunta();
    };

    lista.appendChild(botaoAdd);
}

// ===================== LIMPAR E CRIAR NOVA QUESTÃO =====================

function criarPergunta() {
    const enun = document.getElementById("enuntxt");
    const inputs = document.querySelectorAll("#secalt input[type=text]");
    const checks = document.querySelectorAll(".checkinput");

    enun.value = "";

    inputs.forEach(i => i.value = "");
    checks.forEach(c => c.checked = false);

    voltarCheckbox();
    tipo1.focus();
}

// ===================== SALVAR QUESTÃO ATUAL =====================

function salvarQuestaoAtual() {
    const enun = document.getElementById("enuntxt").value;
    const altDivs = [...document.querySelectorAll("#secalt div")];
    const textos = altDivs.map(div => {
        const inp = div.querySelector('input[type="text"]');
        return inp ? inp.value : "";
    });

    const tipo = document.body.getAttribute("data-tipo") || "1";
    let certas = [];

    if (tipo === "3") {
        // V/F: ler selects .selectVF
        altDivs.forEach((div, i) => {
            const sel = div.querySelector(".selectVF");
            if (sel && sel.value === "V") certas.push(i);
        });
    } else {
        const checks = altDivs.map(div => {
            const chk = div.querySelector(".checkinput");
            return chk ? chk.checked : false;
        });
        certas = checks.reduce((acc, v, i) => v ? [...acc, i] : acc, []);
    }

    // salvar em estrutura
    questoes[questaoAtual] = {
        tipo,
        enunciado: enun,
        alternativas: textos,
        certas
    };
}

// ===================== CARREGAR QUESTÃO DO ASIDE =====================

function carregarQuestao(num) {
    const q = questoes[num];

    if (!q) {
        criarPergunta();
        return;
    }

    document.body.setAttribute("data-tipo", q.tipo);

    // carregar enunciado
    document.getElementById("enuntxt").value = q.enunciado;

    // carregar alternativas
    const inputs = document.querySelectorAll("#secalt input[type=text]");
    q.alternativas.forEach((txt, i) => inputs[i].value = txt);

    // voltar checkbox padrão
    voltarCheckbox();

    // dependendo do tipo, transformar ou marcar
    if (q.tipo == "3") {
        const selects = document.querySelectorAll(".selectVF");
        selects.forEach((s, i) => s.value = q.certas.includes(i) ? "V" : "F");
    } else {
        const checks = document.querySelectorAll(".checkinput");
        checks.forEach((chk, i) => chk.checked = q.certas.includes(i));
    }

    if (q.tipo == "1" || q.tipo == "2") {
        const checks = document.querySelectorAll(".checkinput");
        checks.forEach((chk, i) => chk.checked = q.certas.includes(i));
    }

    // atualizar visual do tipo
    if (q.tipo == "1") tipo1.focus();
    if (q.tipo == "2") tipo2.focus();
    if (q.tipo == "3") tipo3.focus();
}



// ===============================================================
// ===================== CONTROLE DOS TIPOS ======================
// ===============================================================

const tipo1 = document.getElementById("tipo1");
const tipo2 = document.getElementById("tipo2");
const tipo3 = document.getElementById("tipo3");

tipo1.addEventListener("focus", () => mudarTipo(1));
tipo2.addEventListener("focus", () => mudarTipo(2));
tipo3.addEventListener("focus", () => mudarTipo(3));

function mudarTipo(tipo) {
    document.body.setAttribute("data-tipo", tipo);

    if (tipo == 1) {
        voltarCheckbox();
        ativarTipoUnico();
    } 
    else if (tipo == 2) {
        voltarCheckbox();
        ativarTipoMultiplo();
    } 
    else if (tipo == 3) {
        transformarParaVF();
    }
}



// ===============================================================
// ===================== TIPO 1 — ÚNICA CORRETA ==================
// ===============================================================

function ativarTipoUnico() {
    const checks = document.querySelectorAll(".checkinput");

    checks.forEach(chk => {
        chk.onclick = () => {
            checks.forEach(c => {
                if (c !== chk) c.checked = false;
            });
        };
    });
}



// ===============================================================
// ===================== TIPO 2 — MÚLTIPLAS ======================
// ===============================================================

function ativarTipoMultiplo() {
    const checks = document.querySelectorAll(".checkinput");
    checks.forEach(chk => chk.onclick = null);
}



// ===============================================================
// ===================== TIPO 3 — V / F ==========================
// ===============================================================

function transformarParaVF() {
    const divs = document.querySelectorAll("#secalt div");

    divs.forEach(div => {
        const label = div.querySelector(".checklabel");

        if (label.classList.contains("vf-convertido")) return;

        label.style.display = "none";

        const select = document.createElement("select");
        select.className = "selectVF";
        select.innerHTML = `
            <option value="V">V</option>
            <option value="F">F</option>
        `;

        label.classList.add("vf-convertido");
        div.prepend(select);
    });
}



// ===============================================================
// ===================== VOLTAR PARA CHECKBOX ====================
// ===============================================================

function voltarCheckbox() {
    const divs = document.querySelectorAll("#secalt div");

    divs.forEach(div => {
        const select = div.querySelector(".selectVF");
        const label = div.querySelector(".checklabel");

        if (select) select.remove();

        if (label) {
            label.style.display = "inline-flex";
            label.classList.remove("vf-convertido");
        }
    });
}

// ===============================================================
// ========================= SALVAR QUIZ =========================
// ===============================================================

async function salvarTudo() {
    try {
        // garante que a questão atual foi persistida na estrutura questoes
        salvarQuestaoAtual();

        const quiz_id = Number(localStorage.getItem("quiz_id"));
        if (!quiz_id) {
            alert("ID do quiz não encontrado! Salve o quiz primeiro.");
            return;
        }

        // transforma o objeto questoes em uma lista ordenada pelos índices (numéricos)
        const chaves = Object.keys(questoes)
            .map(k => Number(k))
            .filter(n => !Number.isNaN(n))
            .sort((a,b) => a - b);

        if (chaves.length === 0) {
            alert("Nenhuma pergunta encontrada para salvar.");
            return;
        }

        console.log("Salvando quiz", quiz_id, "com perguntas:", chaves);

        for (let num of chaves) {
            const q = questoes[num];

            // validações básicas (mensagens claras)
            if (!q) {
                throw new Error(`Questão ${num} inexistente no objeto questoes.`);
            }
            if (!q.enunciado || String(q.enunciado).trim() === "") {
                alert(`A pergunta ${num} está sem enunciado.`);
                return;
            }
            if (!q.alternativas || q.alternativas.length === 0) {
                alert(`A pergunta ${num} não tem alternativas.`);
                return;
            }

            // montar payload da pergunta
            const perguntaPayload = {
                pe_enunciado: String(q.enunciado).trim(),
                pe_qz_id: quiz_id,
                pe_tipo: Number(q.tipo) || 1
            };

            console.log("Enviando /pergunta payload:", perguntaPayload);

            // enviar pergunta
            const peRes = await fetch("/pergunta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(perguntaPayload)
            });

            const peText = await peRes.text();
            if (!peRes.ok) {
                // mostra resposta textual do servidor para debugging (ex: "Erro ao cadastrar pergunta")
                console.error("Resposta /pergunta (erro):", peText);
                throw new Error("Erro ao salvar pergunta: " + peText);
            }

            // tenta parsear resposta de sucesso
            let peData;
            try {
                peData = JSON.parse(peText);
            } catch (err) {
                console.error("Resposta /pergunta não é JSON mas retornou ok:", peText);
                throw new Error("Resposta do servidor inesperada ao cadastrar pergunta: " + peText);
            }

            const pe_numero = peData.id;
            console.log(`Pergunta ${num} salva com id ${pe_numero}`);

            // SALVAR ALTERNATIVAS — q.alternativas é array de strings (conforme seu código)
            for (let idx = 0; idx < q.alternativas.length; idx++) {
                const texto = String(q.alternativas[idx] ?? "").trim();
                if (!texto) {
                    alert(`A pergunta ${num} tem alternativa vazia (índice ${idx}).`);
                    return;
                }

                // q.certas contém índices das alternativas corretas (mesmo para tipo 3, onde "V" guardamos índices)
                const correta = Array.isArray(q.certas) ? q.certas.includes(idx) : false;

                const altPayload = {
                    av_texto: texto,
                    av_correta: correta ? 1 : 0,
                    av_pe_numero: pe_numero
                };

                console.log("Enviando /alternativa payload:", altPayload);

                const avRes = await fetch("/alternativa", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(altPayload)
                });

                const avText = await avRes.text();
                if (!avRes.ok) {
                    console.error("Resposta /alternativa (erro):", avText);
                    throw new Error("Erro ao salvar alternativa: " + avText);
                }

                // tenta parsear retorno (se quiser usar id)
                try {
                    const avData = JSON.parse(avText);
                    console.log("Alternativa salva id:", avData.id);
                } catch {
                    console.log("Alternativa salva (resposta não-json):", avText);
                }
            } // fim loop alternativas

        } // fim loop perguntas

        console.log("Todas perguntas e alternativas salvas com sucesso.");
        // abre modal de publicação
        abrirModalPublicarQuiz(quiz_id);

    } catch (err) {
        console.error(err);
        // mostra mensagem sugestiva pro usuário e log no console
        alert("Erro ao salvar quiz:\n" + (err && err.message ? err.message : String(err)));
    }
}

// ===============================================================
// ========================= ABRIR MODAL =========================
// ===============================================================

function abrirModalPublicarQuiz(quiz_id) {
    window.quizRecemCriado = quiz_id;

    fetch("/turma")
        .then(res => res.json())
        .then(turmas => {
            let lista = document.getElementById("listaTurmas");
            lista.innerHTML = "";

            turmas.forEach(t => {
                let div = document.createElement("div");
                div.innerHTML = `
                    <label>
                        <input type="checkbox" class="turmaCheck" value="${t.tu_id}">
                        ${t.tu_nome}
                    </label>
                `;
                lista.appendChild(div);
            });

            document.getElementById("modalPublicar").style.display = "flex";
        });
}

function fecharModal() {
    document.getElementById("modalPublicar").style.display = "none";
}

// ===============================================================
// ==================== CONFIRMAR PUBLICAÇÃO =====================
// ===============================================================

function confirmarPublicacao() {
    const turmasSelecionadas = [...document.querySelectorAll(".turmaCheck:checked")]
        .map(t => t.value);

    const visibilidade = document.querySelector("input[name=visibilidade]:checked").value;

    fetch("/publicarQuiz", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            quiz_id: window.quizRecemCriado,
            turmas: turmasSelecionadas,
            visibilidade: visibilidade
        })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        fecharModal();
        window.location.href = "homeprof.html";
    });
}

// ===============================================================
// ========================== CANCELAR ===========================
// ===============================================================

function cancelarCriacao() {
    if (!confirm("Deseja realmente cancelar o quiz?")) return;

    // só apaga o ID temporário, o quiz ainda não foi salvo no banco
    localStorage.removeItem("quiz_id");

    window.location.href = "cadquiz.html";
}

