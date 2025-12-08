const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação das tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Aluno(
            al_id INTEGER PRIMARY KEY AUTOINCREMENT,
            al_email TEXT UNIQUE NOT NULL,
            al_nome TEXT NOT NULL,
            al_senha TEXT NOT NULL,
            al_bio VARCHAR(200),
            al_nivel INTEGER
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Prof(
            pr_id INTEGER PRIMARY KEY AUTOINCREMENT,
            pr_email TEXT UNIQUE NOT NULL,
            pr_nome TEXT NOT NULL,
            pr_senha TEXT NOT NULL,
            pr_bio VARCHAR(200),
            pr_nivel INTEGER
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Turma(
            tu_id INTEGER PRIMARY KEY AUTOINCREMENT,
            tu_nome VARCHAR(40) NOT NULL,
            tu_desc VARCHAR(120),
            tu_pr_id VARCHAR(12),
            FOREIGN KEY (tu_pr_id) REFERENCES Prof (pr_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS AlunoTurma(
            AT_tu_id INTEGER,
            AT_al_id INTEGER,
            PRIMARY KEY (AT_tu_id, AT_al_id),
            FOREIGN KEY (AT_tu_id) REFERENCES Turma (tu_id),
            FOREIGN KEY (AT_al_id) REFERENCES Aluno (al_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Quiz(
            qz_id INTEGER PRIMARY KEY AUTOINCREMENT,
            qz_nome VARCHAR(40) NOT NULL,
            qz_valor INTEGER NOT NULL,
            qz_prazo DATE NOT NULL,
            qz_pr_id VARCHAR(12),
            qz_visibilidade TEXT DEFAULT 'turmas',
            FOREIGN KEY (qz_pr_id) REFERENCES Prof (pr_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Pergunta(
            pe_numero INTEGER PRIMARY KEY AUTOINCREMENT,
            pe_enunciado VARCHAR(200) NOT NULL,
            pe_tipo INTEGER DEFAULT 1,
            pe_qz_id VARCHAR(12),
            FOREIGN KEY (pe_qz_id) REFERENCES Quiz (qz_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Alternativa(
            av_numero INTEGER PRIMARY KEY AUTOINCREMENT,
            av_texto VARCHAR(120) NOT NULL,
            av_correta BIT,
            av_pe_numero INTEGER,
            FOREIGN KEY (av_pe_numero) REFERENCES Pergunta (pe_numero)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS QuizPublicacao(
            qp_id INTEGER PRIMARY KEY AUTOINCREMENT,
            qp_qz_id INTEGER NOT NULL,
            qp_tu_id INTEGER,
            FOREIGN KEY (qp_qz_id) REFERENCES Quiz(qz_id),
            FOREIGN KEY (qp_tu_id) REFERENCES Turma(tu_id)
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS Resposta (
            re_id INTEGER PRIMARY KEY AUTOINCREMENT,
            re_data TEXT,
            re_hora TEXT,
            re_certas INTEGER,
            re_nota INTEGER,
            re_al_id INTEGER,
            re_qz_id INTEGER,
            FOREIGN KEY (re_al_id) REFERENCES Aluno(al_id),
            FOREIGN KEY (re_qz_id) REFERENCES Quiz(qz_id)
        )
    `);

    console.log('Tabelas criadas com sucesso.');
});

///////////////////////////// Rotas para Aluno /////////////////////////////
///////////////////////////// Rotas para Aluno /////////////////////////////
///////////////////////////// Rotas para Aluno /////////////////////////////

// Cadastrar aluno
app.post('/aluno', (req, res) => {
    const { email, nome, senha } = req.body;

    if (!email || !nome || !senha) {
        return res.status(400).send('todos os campos são obrigatórios.');
    }

    const query = `INSERT INTO Aluno (al_email, al_nome, al_senha) VALUES (?, ?, ?)`;
    db.run(query, [email, nome, senha], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar.');
        }
        res.status(201).send({ id: this.lastID, message: 'cadastrado com sucesso.' });
    });
});

// Listar alunos
// Endpoint para listar todos alunos, oq é referente a busca ta comentado
app.get('/aluno', (req, res) => {
    /*
    const email = req.query.email || '';  // Recebe o email da query string (se houver)

    if (email) {
        // Se email foi passado, busca cadastros que possuam esse email ou parte dele
        const query = `SELECT * FROM cadastro WHERE email LIKE ?`;

        db.all(query, [`%${email}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar cadastros.' });
            }
            res.json(rows);  // Retorna os cadastros encontrados ou um array vazio
        });
    } else {
    */
        // Se email não foi passado, retorna todos os cadastros
        const query = `SELECT * FROM Aluno`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar cadastros.' });
            }
            res.json(rows);  // Retorna todos os cadastros
        });
});

// Atualizar aluno
app.put('/aluno/email/:email', (req, res) => {
    const { email } = req.params;
    const { nome, senha} = req.body;

    const query = `UPDATE aluno SET al_nome = ?, al_senha = ? WHERE al_email = ?`;
    db.run(query, [nome, senha, email], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar aluno.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Aluno não encontrado.');
        }
        res.send('Aluno atualizado com sucesso.');
    });
});

///////////////////////////// Rotas para Prof /////////////////////////////
///////////////////////////// Rotas para Prof /////////////////////////////
///////////////////////////// Rotas para Prof /////////////////////////////

// Cadastrar prof
app.post('/prof', (req, res) => {
    const { email, nome, senha } = req.body;

    if (!email || !nome || !senha) {
        return res.status(400).send('todos os campos são obrigatórios.');
    }

    const query = `INSERT INTO Prof (pr_email, pr_nome, pr_senha) VALUES (?, ?, ?)`;
    db.run(query, [email, nome, senha], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar.');
        }
        res.status(201).send({ id: this.lastID, message: 'cadastrado com sucesso.' });
    });

});

// Listar professores
// Endpoint para listar todos professores, oq é referente a busca ta comentado
app.get('/prof', (req, res) => {
    /*
    const email = req.query.email || '';  // Recebe o email da query string (se houver)

    if (email) {
        // Se email foi passado, busca cadastros que possuam esse email ou parte dele
        const query = `SELECT * FROM cadastro WHERE email LIKE ?`;

        db.all(query, [`%${email}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar cadastros.' });
            }
            res.json(rows);  // Retorna os cadastros encontrados ou um array vazio
        });
    } else {
    */
        // Se email não foi passado, retorna todos os cadastros
        const query = `SELECT * FROM Prof`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar cadastros.' });
            }
            res.json(rows);  // Retorna todos os cadastros
        });
});

// Atualizar professores
app.put('/prof/email/:email', (req, res) => {
    const { email } = req.params;
    const { nome, senha} = req.body;

    const query = `UPDATE prof SET pr_nome = ?, pr_senha = ? WHERE pr_email = ?`;
    db.run(query, [nome, senha, email], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar professores.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Professores não encontrado.');
        }
        res.send('Professores atualizado com sucesso.');
    });
});

///////////////////////////// Rotas para Turma /////////////////////////////
///////////////////////////// Rotas para Turma /////////////////////////////
///////////////////////////// Rotas para Turma /////////////////////////////

// Cadastrar turma
app.post('/turma', (req, res) => {
    const { tu_nome, tu_desc, tu_pr_id} = req.body;

    if (!tu_nome) {
        return res.status(400).send('nome e id do professor são obrigatórios.');
    }

    /*
    // Verifica se o professor existe
    const checkProf = `SELECT * FROM Prof WHERE pr_id = ?`;
    db.get(checkProf, [tu_pr_id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao verificar professor.');
        }

        if (!row) {
            // Se não encontrou o professor
            return res.status(400).send('ID do professor não encontrado.');
        }

        // Se encontrou o professor, insere a turma
    */
        const query = `INSERT INTO turma (tu_nome, tu_desc, tu_pr_id) VALUES (?, ?, ?)`;
        db.run(query, [tu_nome, tu_desc, tu_pr_id], function (err) {
            if (err) {
                return res.status(500).send('Erro ao cadastrar.');
            }
            res.status(201).send({ id: this.lastID, message: 'cadastrado com sucesso.' });
        });
    });
//});


// Listar turmas
// Endpoint para listar todas as turmas ou buscar por email
app.get('/turma', (req, res) => {
    const tu_nome = req.query.nome || '';  // Recebe o nome da query string (se houver)

    if (tu_nome) {
        // Se nome foi passado, busca turmas que possuam esse nome ou parte dele
        const query = `SELECT * FROM turma WHERE tu_nome LIKE ?`;

        db.all(query, [`%${tu_nome}%`], (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar turmas.' });
            }
            res.json(rows);  // Retorna as turmas encontradas ou um array vazio
        });
    } else {
        // Se nome não foi passado, retorna todas as turmas
        const query = `SELECT * FROM turma`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erro ao buscar turmas.' });
            }
            res.json(rows);  // Retorna todas as turmas
        });
    }
});

// Atualizar turma
app.put('/turma/tu_id/:tu_id', (req, res) => {
    const { tu_id } = req.params;
    const { tu_nome, tu_desc} = req.body;

    const query = `UPDATE turma SET tu_nome = ?, tu_desc = ? WHERE tu_id = ?`;
    db.run(query, [tu_nome, tu_desc, tu_id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao atualizar turma.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Turma não encontrada.');
        }
        res.send('Turma atualizada com sucesso.');
    });
});

// Entrar aluno na turma
app.post("/turma/:tu_id/addAluno", (req, res) => {
    const { tu_id } = req.params;
    const { al_id } = req.body;

    db.run(
        `INSERT INTO AlunoTurma (AT_tu_id, AT_al_id) VALUES (?, ?)`,
        [tu_id, al_id],
        function(err) {
            if (err) return res.status(500).send("Erro ao adicionar aluno na turma");
            res.send("Aluno adicionado com sucesso!");
        }
    );
});

// Listar turmas que o aluno participa
app.get("/aluno/:al_id/turmas", (req, res) => {
    const { al_id } = req.params;

    const query = `
        SELECT t.*
        FROM AlunoTurma at
        JOIN Turma t ON t.tu_id = at.AT_tu_id
        WHERE at.AT_al_id = ?
    `;

    db.all(query, [al_id], (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar turmas do aluno");
        res.json(rows);
    });
});

// Listar quizes na turma
app.get("/turma/:tu_id/quizzes", (req, res) => {
    const { tu_id } = req.params;

    const query = `
        SELECT q.*
        FROM QuizPublicacao qp
        JOIN Quiz q ON q.qz_id = qp.qp_qz_id
        WHERE qp.qp_tu_id = ?
    `;

    db.all(query, [tu_id], (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar quizzes da turma");
        res.json(rows);
    });
});

// Listar alunos na turma
app.get("/turma/:tu_id/alunos", (req, res) => {
    const { tu_id } = req.params;

    const query = `
        SELECT a.al_id, a.al_nome, a.al_email
        FROM AlunoTurma at
        JOIN Aluno a ON a.al_id = at.AT_al_id
        WHERE at.AT_tu_id = ?
    `;

    db.all(query, [tu_id], (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar alunos da turma");
        res.json(rows);
    });
});

///////////////////////////// Rotas para Quiz /////////////////////////////
///////////////////////////// Rotas para Quiz /////////////////////////////
///////////////////////////// Rotas para Quiz /////////////////////////////

// Cadastrar quiz
app.post('/quiz', (req, res) => {
    const { qz_nome, qz_valor, qz_prazo, qz_pr_id } = req.body;

    if (!qz_nome || !qz_valor || !qz_prazo) {
        return res.status(400).send('todos os campos são obrigatórios.');
    }

    const query = `INSERT INTO Quiz (qz_nome, qz_valor, qz_prazo, qz_pr_id) VALUES (?, ?, ?, ?)`;
    db.run(query, [qz_nome, qz_valor, qz_prazo, qz_pr_id], function (err) {
        if (err) {
            return res.status(500).send('Erro ao cadastrar.');
        }
        res.status(201).send({ id: this.lastID, message: 'cadastrado com sucesso.' });
    });
});

// Cadastrar pergunta
app.post("/pergunta", (req, res) => {
    const { pe_enunciado, pe_qz_id, pe_tipo } = req.body;

    const query = `
        INSERT INTO Pergunta (pe_enunciado, pe_tipo, pe_qz_id)
        VALUES (?, ?, ?)
    `;

    db.run(query, [pe_enunciado, pe_tipo, pe_qz_id], function (err) {
        if (err) {
            console.error("Erro ao cadastrar pergunta:", err.message);
            return res.status(500).send("Erro ao cadastrar pergunta");
        }
        res.status(201).send({ id: this.lastID });
    });
});

// Cadastrar alternativa
app.post("/alternativa", (req, res) => {
    const { av_texto, av_correta, av_pe_numero } = req.body;

    const query = `
        INSERT INTO Alternativa (av_texto, av_correta, av_pe_numero)
        VALUES (?, ?, ?)
    `;

    db.run(query, [av_texto, av_correta, av_pe_numero], function (err) {
        if (err) return res.status(500).send("Erro ao cadastrar alternativa");
        res.status(201).send({ id: this.lastID });
    });
});

// Listar quizes pro professor
app.get("/quiz/prof/:pr_id", (req, res) => {
    const pr_id = req.params.pr_id;

    const query = `
        SELECT *
        FROM Quiz
        WHERE qz_pr_id = ?
    `;

    db.all(query, [pr_id], (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar quizzes");
        res.json(rows);
    });
});

ie:

app.get("/quiz/publicados/:pr_id", (req, res) => {
    const pr_id = req.params.pr_id;

    const query = `
        SELECT q.*, qp.qp_tu_id
        FROM Quiz q
        LEFT JOIN QuizPublicacao qp ON qp.qp_qz_id = q.qz_id
        WHERE q.qz_pr_id = ?
    `;

    db.all(query, [pr_id], (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar quizzes publicados");
        res.json(rows);
    });
});


////////////////////////// Rotas para Publicar Quiz //////////////////////////
////////////////////////// Rotas para Publicar Quiz //////////////////////////
////////////////////////// Rotas para Publicar Quiz //////////////////////////

app.post("/publicarQuiz", (req, res) => {
    const { quiz_id, turmas, visibilidade } = req.body;

    db.run(
        `UPDATE Quiz SET qz_visibilidade = ? WHERE qz_id = ?`,
        [visibilidade, quiz_id]
    );

    // salvar nas turmas
    turmas.forEach(tu_id => {
        db.run(
            `INSERT INTO QuizPublicacao (qp_qz_id, qp_tu_id) VALUES (?, ?)`,
            [quiz_id, tu_id]
        );
    });

    res.send("Quiz publicado com sucesso!");
});

////////////////////////// Rotas para Responder Quiz //////////////////////////
////////////////////////// Rotas para Responder Quiz //////////////////////////
////////////////////////// Rotas para Responder Quiz //////////////////////////

app.get("/quiz/:qz_id/completo", (req, res) => {
    const { qz_id } = req.params;

    const queryPerguntas = `
        SELECT 
            pe_numero,
            pe_enunciado,
            pe_qz_id,
            pe_tipo
        FROM Pergunta 
        WHERE pe_qz_id = ?
    `;

    db.all(queryPerguntas, [qz_id], (err, perguntas) => {
        if (err) return res.status(500).send("Erro ao buscar perguntas");

        if (perguntas.length === 0)
            return res.json({ perguntas: [] });

        const ids = perguntas.map(p => p.pe_numero);

        const queryAlternativas = `
            SELECT * FROM Alternativa
            WHERE av_pe_numero IN (${ids.map(_ => '?').join(',')})
        `;

        db.all(queryAlternativas, ids, (err, alternativas) => {
            if (err) return res.status(500).send("Erro ao buscar alternativas");

            // Agrupar alternativas nas perguntas
            perguntas.forEach(p => {
                p.alternativas = alternativas.filter(a => a.av_pe_numero === p.pe_numero);
            });

            res.json({ perguntas });
        });
    });
});

app.post("/quiz/iniciar", (req, res) => {
    const { al_id, qz_id } = req.body;

    const data = new Date();
    const re_data = data.toISOString().split('T')[0];
    const re_hora = data.toTimeString().slice(0, 8);

    const query = `
        INSERT INTO Resposta (re_data, re_hora, re_certas, re_nota, re_al_id, re_qz_id)
        VALUES (?, ?, 0, 0, ?, ?)
    `;

    db.run(query, [re_data, re_hora, al_id, qz_id], function(err){
        if (err) return res.status(500).send("Erro ao iniciar tentativa");

        res.json({ re_id: this.lastID });
    });
});

app.post("/quiz/finalizar", (req, res) => {
    const { re_id, respostas } = req.body;
    // respostas = [ { pe_numero: X, av_numero: Y }, ... ]
    if (!re_id || !Array.isArray(respostas)) return res.status(400).send("Dados inválidos");

    // 1) Obter o qz_id da tentativa
    const queryRe = `SELECT re_qz_id FROM Resposta WHERE re_id = ?`;
    db.get(queryRe, [re_id], (err, row) => {
        if (err || !row) return res.status(500).send("Erro ao buscar tentativa");

        const qz_id = row.re_qz_id;

        // 1.5) Obter o valor do quiz (qz_valor)
        const queryQuiz = `SELECT qz_valor FROM Quiz WHERE qz_id = ?`;
        db.get(queryQuiz, [qz_id], (err, quizRow) => {
            if (err || !quizRow) return res.status(500).send("Erro ao buscar valor do quiz");
            const qz_valor = Number(quizRow.qz_valor) || 0;

            // 2) Buscar todas as perguntas do quiz
            const queryPerg = `SELECT pe_numero FROM Pergunta WHERE pe_qz_id = ?`;
            db.all(queryPerg, [qz_id], (err, perguntas) => {
                if (err) return res.status(500).send("Erro ao buscar perguntas");

                const perguntaIds = perguntas.map(p => p.pe_numero);
                if (perguntaIds.length === 0) return res.status(400).send("Quiz sem perguntas");

                // 3) Buscar todas as alternativas para essas perguntas
                const queryAlts = `
                    SELECT * FROM Alternativa
                    WHERE av_pe_numero IN (${perguntaIds.map(_ => '?').join(',')})
                `;
                db.all(queryAlts, perguntaIds, (err, todasAlts) => {
                    if (err) return res.status(500).send("Erro na correção");

                    // construir mapa de corretas por pergunta
                    const corretasMap = {}; // pe_numero -> Set(av_numero)
                    perguntaIds.forEach(id => corretasMap[id] = new Set());
                    todasAlts.forEach(a => {
                        if (a.av_correta == 1) {
                            corretasMap[a.av_pe_numero].add(a.av_numero);
                        }
                    });

                    // montar seleções do aluno por pergunta
                    const selecoes = {}; // pe_numero -> Set(av_numero)
                    respostas.forEach(r => {
                        if (!selecoes[r.pe_numero]) selecoes[r.pe_numero] = new Set();
                        // permitir que frontend envie múltiplas entradas (uma por alternativa) ou arrays
                        selecoes[r.pe_numero].add(r.av_numero);
                    });

                    let certas = 0;
                    let totalPoints = 0;

                    perguntaIds.forEach(pe => {
                        const corretasSet = corretasMap[pe] || new Set();
                        const correctCount = corretasSet.size || 0;
                        const selectedSet = selecoes[pe] || new Set();

                        // contar quantos selecionados estão corretos
                        let selectedCorrect = 0;
                        let selectedIncorrect = 0;
                        for (let av of selectedSet) {
                            if (corretasSet.has(av)) selectedCorrect++;
                            else selectedIncorrect++;
                        }

                        if (correctCount > 0) {
                            totalPoints += selectedCorrect / correctCount;
                        } else {
                            // sem alternativas corretas definidas, considera 0
                        }

                        // considera questão "certa" apenas se marcou todas corretas e nenhuma incorreta
                        if (correctCount > 0 && selectedCorrect === correctCount && selectedIncorrect === 0) certas++;
                    });

                    const totalQuestions = perguntaIds.length;

                    // --- AQUI: nota baseada no valor do quiz (qz_valor) ---
                    // totalPoints varia entre 0 e totalQuestions, então (totalPoints/totalQuestions) é fração correta.
                    const notaFloat = (totalPoints / totalQuestions) * qz_valor;
                    const nota = Math.round(notaFloat);

                    // atualizar a tabela Resposta com certas e nota
                    const upd = `UPDATE Resposta SET re_certas = ?, re_nota = ? WHERE re_id = ?`;
                    db.run(upd, [certas, nota, re_id], function(err) {
                        if (err) return res.status(500).send("Erro ao salvar resultado");
                        return res.json({ certas, nota, max: qz_valor });
                    });
                });
            });
        });
    });
});

app.get("/aluno/:al_id/feitos", (req, res) => {
    const { al_id } = req.params;

    const query = `
        SELECT re_qz_id 
        FROM Resposta
        WHERE re_al_id = ?
    `;

    db.all(query, [al_id], (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar quizzes feitos");

        const feitos = rows.map(r => r.re_qz_id);
        res.json(feitos);
    });
});

///////////////////////// Rotas pro Relatorio Eu Acho /////////////////////////
///////////////////////// Rotas pro Relatorio Eu Acho /////////////////////////
///////////////////////// Rotas pro Relatorio Eu Acho /////////////////////////

app.get('/quiz/:qz_id', (req, res) => {
    const { qz_id } = req.params;
    const query = `SELECT * FROM Quiz WHERE qz_id = ?`;

    db.get(query, [qz_id], (err, row) => {
        if (err) return res.status(500).send('Erro ao buscar quiz.');
        if (!row) return res.status(404).send('Quiz não encontrado.');
        res.json(row);
    });
});

app.get('/quiz/:qz_id/respostas', (req, res) => {
  const { qz_id } = req.params;

  const query = `
    SELECT 
        r.re_id,
        r.re_data || ' ' || r.re_hora AS dataHora,
        r.re_certas AS qtdCertas,
        r.re_nota,
        a.al_nome AS alunoNome,
        (
            SELECT COUNT(*)
            FROM Pergunta p
            WHERE p.pe_qz_id = r.re_qz_id
        ) AS totalQuestoes
    FROM Resposta r
    LEFT JOIN Aluno a ON r.re_al_id = a.al_id
    WHERE r.re_qz_id = ?
  `;

  db.all(query, [qz_id], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar respostas:", err);
      return res.status(500).send("Erro ao buscar respostas.");
    }
    res.json(rows);
  });
});


/////////////////////////// Outras Merdas Malditas ////////////////////////////
/////////////////////////// Outras Merdas Malditas ////////////////////////////
/////////////////////////// Outras Merdas Malditas ////////////////////////////

//A parada que fazem os alunos q existem conseguirem comprovar sua 
//existencia atraves do loging (loging>>>>)

app.post("/login/aluno", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email/usuário e senha obrigatórios" });
    }

    const sql = `
        SELECT * FROM Aluno 
        WHERE (al_email = ? OR al_nome = ?)
        AND al_senha = ?
    `;

    db.get(sql, [email, email, senha], (err, row) => {
        if (err) return res.status(500).json({ error: "Erro no servidor" });

        if (!row) return res.status(401).json({ error: "Credenciais inválidas" });

        res.json({ message: "Login OK", aluno: row });
    });
});

// O mesmo para os professores

app.post("/login/prof", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email/usuário e senha obrigatórios" });
    }

    const sql = `
        SELECT * FROM Prof 
        WHERE (pr_email = ? OR pr_nome = ?)
        AND pr_senha = ?
    `;

    db.get(sql, [email, email, senha], (err, row) => {
        if (err) return res.status(500).json({ error: "Erro no servidor" });

        if (!row) return res.status(401).json({ error: "Credenciais inválidas" });

        res.json({ message: "Login OK", prof: row });
    });
});

// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

