-- ============================================================
-- Atividade 8 - Normalizacao de Dados e Arquitetura de Software
-- Entrega em formato SQL, com comentarios curtos e diretos
-- ============================================================

-- ============================================================
-- 1) Tabela de Matriculas (1FN)
-- Violacao: campo com varios valores no mesmo lugar
-- Regra: cada coluna deve ter um valor atomico
-- ============================================================

CREATE TABLE matriculas (
    matricula_id INT NOT NULL,
    aluno_nome   VARCHAR(100) NOT NULL,
    disciplina   VARCHAR(100) NOT NULL,
    nota         DECIMAL(4,1),
    PRIMARY KEY (matricula_id, disciplina)
);

-- Ana Lima sai de 1 linha com lista para 3 linhas
INSERT INTO matriculas VALUES
    (1, 'Ana Lima', 'Matematica', 8.5),
    (1, 'Ana Lima', 'Fisica', 7.0),
    (1, 'Ana Lima', 'Quimica', 9.0);

-- ============================================================
-- 2) Tabela de Vendas (3FN)
-- Cadeia: venda_id -> categoria -> gerente
-- Problema: repetir gerente em venda gera inconsistencia
-- ============================================================

CREATE TABLE gerentes (
    gerente_id INT NOT NULL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL
);

CREATE TABLE categorias (
    categoria_id INT NOT NULL PRIMARY KEY,
    nome         VARCHAR(100) NOT NULL,
    gerente_id   INT NOT NULL REFERENCES gerentes(gerente_id)
);

CREATE TABLE vendas (
    venda_id     INT NOT NULL PRIMARY KEY,
    produto      VARCHAR(100) NOT NULL,
    categoria_id INT NOT NULL REFERENCES categorias(categoria_id),
    valor        DECIMAL(10,2) NOT NULL
);

-- Troca de gerente: mexe so na tabela certa
UPDATE gerentes
SET nome = 'Roberto Lima'
WHERE gerente_id = 1;

-- ============================================================
-- 3) Sistema de Restaurante (1FN -> 2FN -> 3FN)
-- 1FN: separar itens repetidos
-- 2FN: tirar o que depende so de parte da chave
-- 3FN: tirar dependencias transitivas
-- Total: melhor calcular via query
-- ============================================================

CREATE TABLE clientes (
    cliente_id INT NOT NULL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    telefone   VARCHAR(20)
);

CREATE TABLE pedidos (
    pedido_id  INT NOT NULL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(cliente_id),
    data_pedido DATE NOT NULL,
    status     VARCHAR(30) NOT NULL
);

CREATE TABLE produtos (
    produto_id INT NOT NULL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    preco      DECIMAL(10,2) NOT NULL
);

CREATE TABLE pedido_itens (
    pedido_item_id INT NOT NULL PRIMARY KEY,
    pedido_id      INT NOT NULL REFERENCES pedidos(pedido_id),
    produto_id     INT NOT NULL REFERENCES produtos(produto_id),
    quantidade     INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL
);

-- ============================================================
-- 4) Biblioteca (2FN)
-- titulo_livro depende de livro_id
-- usuario_email depende de usuario_id
-- ============================================================

CREATE TABLE livros (
    livro_id     INT NOT NULL PRIMARY KEY,
    titulo_livro VARCHAR(150) NOT NULL,
    autor        VARCHAR(100)
);

CREATE TABLE usuarios (
    usuario_id    INT NOT NULL PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    usuario_email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE emprestimos (
    emprestimo_id   INT NOT NULL PRIMARY KEY,
    livro_id        INT NOT NULL REFERENCES livros(livro_id),
    usuario_id      INT NOT NULL REFERENCES usuarios(usuario_id),
    data_emprestimo DATE NOT NULL,
    data_devolucao  DATE
);

-- Livro novo sem emprestimo: com tabelas separadas isso nao trava cadastro

-- ============================================================
-- 5) Sistema de Clinica (3FN)
-- 1FN: procedimentos multivalorados
-- 2FN: dados de paciente/plano/medico/sala nao devem repetir
-- 3FN: cada coisa no seu lugar
-- Cobertura do plano: altera so uma tabela
-- ============================================================

CREATE TABLE pacientes (
    paciente_id   INT NOT NULL PRIMARY KEY,
    paciente_nome VARCHAR(150) NOT NULL,
    paciente_cpf  VARCHAR(14) NOT NULL UNIQUE
);

CREATE TABLE planos_saude (
    plano_id        INT NOT NULL PRIMARY KEY,
    plano_nome      VARCHAR(100) NOT NULL UNIQUE,
    plano_cobertura  INT NOT NULL
);

CREATE TABLE especialidades (
    especialidade_id INT NOT NULL PRIMARY KEY,
    nome             VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE medicos (
    medico_id       INT NOT NULL PRIMARY KEY,
    medico_nome     VARCHAR(150) NOT NULL,
    medico_crm      VARCHAR(30) NOT NULL UNIQUE,
    especialidade_id INT NOT NULL REFERENCES especialidades(especialidade_id)
);

CREATE TABLE salas (
    sala_id     INT NOT NULL PRIMARY KEY,
    sala_numero VARCHAR(20) NOT NULL,
    sala_andar   VARCHAR(20) NOT NULL
);

CREATE TABLE consultas (
    consulta_id INT NOT NULL PRIMARY KEY,
    paciente_id  INT NOT NULL REFERENCES pacientes(paciente_id),
    plano_id     INT NOT NULL REFERENCES planos_saude(plano_id),
    medico_id    INT NOT NULL REFERENCES medicos(medico_id),
    sala_id      INT NOT NULL REFERENCES salas(sala_id),
    data_consulta DATE NOT NULL
);

CREATE TABLE procedimentos (
    procedimento_id INT NOT NULL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE consulta_procedimentos (
    consulta_id     INT NOT NULL REFERENCES consultas(consulta_id),
    procedimento_id INT NOT NULL REFERENCES procedimentos(procedimento_id),
    PRIMARY KEY (consulta_id, procedimento_id)
);

-- Reflexao:
-- Se o plano Unimed mudar de 80% para 70%, altera so 1 linha em planos_saude.
-- No modelo flat, teria que atualizar varias consultas.

