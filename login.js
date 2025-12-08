async function loginAluno(event) {
    event.preventDefault();

    const email = document.getElementById("alemail").value.trim();
    const senha = document.getElementById("alsenha").value.trim();

    try {
        const response = await fetch("/login/aluno", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Erro ao fazer login");
            return;
        }

        // 🔥 SALVAR IGUAL selecconta.js
        const dados = {
            tipo: "aluno",
            id: result.aluno.al_id,
            email: result.aluno.al_email,
            nome: result.aluno.al_nome
        };

        localStorage.setItem("usuario", JSON.stringify(dados));

        alert("Login realizado!");
        window.location.href = "homealuno.html";

    } catch (err) {
        alert("Erro ao fazer login.");
    }
}

async function loginProf(event) {
    event.preventDefault();

    const email = document.getElementById("premail").value.trim();
    const senha = document.getElementById("prsenha").value.trim();

    try {
        const response = await fetch("/login/prof", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Erro ao fazer login");
            return;
        }

        // 🔥 SALVAR IGUAL selecconta.js
        const dados = {
            tipo: "prof",
            id: result.prof.pr_id,
            email: result.prof.pr_email,
            nome: result.prof.pr_nome
        };

        localStorage.setItem("usuario", JSON.stringify(dados));

        alert("Login realizado!");
        window.location.href = "homeprof.html";

    } catch (err) {
        alert("Erro ao fazer login.");
    }
}

function verSenhaProf() {
    const inputao = document.getElementById("prsenha");
    const divzao = document.getElementById("prdivsenha");
    const imagizona = document.getElementById("przoi");
    if (inputao.type === "password") {
        inputao.type = "text";
        divzao.style.backgroundColor = "#ffda33";
        imagizona.src = "imagens/vesim.png";
    } else {
        inputao.type = "password";
        divzao.style.backgroundColor = "#e4e4e4";
        imagizona.src = "imagens/venao.png";
    }
}

function verSenhaAluno() {
    const inputao = document.getElementById("alsenha");
    const divzao = document.getElementById("aldivsenha");
    const imagizona = document.getElementById("alzoi");
    if (inputao.type === "password") {
        inputao.type = "text";
        divzao.style.backgroundColor = "#ffda33";
        imagizona.src = "imagens/vesim.png";
    } else {
        inputao.type = "password";
        divzao.style.backgroundColor = "#e4e4e4";
        imagizona.src = "imagens/venao.png";
    }
}

function darkmode() {
    document.body.classList.toggle("dark");
}
