// pegar qz_id da URL
function getQuizId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("qz_id");
}

function formatDateTime(dt) {
    return new Date(dt).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

async function carregarRelatorio() {
    const qz_id = getQuizId();
    if (!qz_id) {
        alert("ID do quiz não encontrado.");
        return;
    }

    // Buscar quiz
    const quizRes = await fetch(`/quiz/${qz_id}`);
    const quiz = await quizRes.json();

    document.getElementById("quizNome").textContent =
        `Quiz: ${quiz.qz_nome} (Valor: ${quiz.qz_valor})`;

    // Buscar respostas
    const respRes = await fetch(`/quiz/${qz_id}/respostas`);
    const respostas = await respRes.json();

    const tbody = document.querySelector("#relatorioTable tbody");
    tbody.innerHTML = "";

    if (respostas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Nenhuma resposta registrada.</td></tr>`;
        return;
    }

    respostas.forEach(r => {
        const nota = Number(r.re_nota).toFixed(2);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.alunoNome}</td>
            <td>${formatDateTime(r.dataHora)}</td>
            <td>${r.qtdCertas} / ${r.totalQuestoes}</td>
            <td>${nota}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = carregarRelatorio;
