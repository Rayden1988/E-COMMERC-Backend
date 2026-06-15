# Atividade 8 | Banco de Dados

## 1. Tabela de Matriculas - 1FN

**Tarefa A:** A regra violada e a de **atributos nao atomicos**. A tabela mistura varios valores no mesmo campo ou repete grupos de informacoes em uma unica linha.

**Tarefa B:** Um atributo atomico e aquele que guarda **um unico valor por celula**. Se um campo precisa ser dividido em varios valores, ele nao esta em 1FN.

**Tarefa C:** A tabela normalizada deve separar cada informacao repetida em linhas ou tabelas proprias. Em geral, a ficha da aluna **Ana Lima** vira **uma linha por combinacao aluno + disciplina/curso/item repetido**. Se houver tres itens repetidos, serao tres linhas.

Exemplo de estrutura:

| matricula_id | aluno_nome | curso | disciplina |
|---|---|---|---|
| 1 | Ana Lima | ADS | Banco de Dados |
| 2 | Ana Lima | ADS | Programacao Web |
| 3 | Ana Lima | ADS | Arquitetura de Software |

---

## 2. Tabela de Vendas - 3FN

**Tarefa A:** A cadeia de dependencia tende a ser:

`venda_id -> categoria_id -> gerente_nome`

Ou seja, a venda aponta para uma categoria, e a categoria aponta para o gerente.

**Tarefa B:** Se o gerente da categoria mudar, o nome antigo ficaria preso em vendas ja registradas. Isso cria inconsistencia historica e quebra a manutencao dos dados.

**Tarefa C:** Um desenho simples em 3 tabelas:

- `gerentes(gerente_id, nome)`
- `categorias(categoria_id, nome, gerente_id)`
- `vendas(venda_id, categoria_id, valor, data_venda)`

Assim, o nome do gerente nao precisa ser repetido em cada venda.

---

## 3. Sistema de Restaurante - 1FN -> 2FN -> 3FN

**Passo 1 - 1FN:** Separar itens repetidos, como varios produtos no mesmo pedido.

**Passo 2 - 2FN:** Tirar dados que dependem so de parte da chave composta. Exemplo: dados do pedido ficam na tabela do pedido, e os itens ficam em outra tabela.

**Passo 3 - 3FN:** Tirar dependencias transitivas. Exemplo: endereco, cliente e produto nao devem ficar repetidos na tabela de itens se eles ja existem em tabelas proprias.

**Sobre o campo `total`:** o mais tecnico e seguro e **calcular via query** na maior parte dos casos, porque o total pode ser obtido a partir dos itens do pedido. Se for armazenado, precisa de controle extra para evitar inconsistencias.

Exemplo de estrutura:

- `pedidos(pedido_id, cliente_id, data, status)`
- `pedido_itens(pedido_item_id, pedido_id, produto_id, quantidade, preco_unitario)`
- `produtos(produto_id, nome, preco)`
- `clientes(cliente_id, nome, telefone)`

---

## 4. Gestao de Biblioteca - 2FN

**Tarefa A:**  
- `titulo_livro` depende apenas de `livro_id`
- `usuario_email` depende apenas de `usuario_id`

Se a chave for composta, esses campos nao dependem de toda a chave, entao existe dependencia parcial.

**Tarefa B:** Uma anomalia de insercao acontece quando nao consigo cadastrar um livro novo se ele ainda nao foi emprestado. Ou seja, o livro fica preso a existencia de um emprestimo.

**Tarefa C:** Schema final:

- `livros(livro_id, titulo_livro, autor)`
- `usuarios(usuario_id, usuario_email, nome)`
- `emprestimos(emprestimo_id, livro_id, usuario_id, data_emprestimo, data_devolucao)`

---

## 5. Desafio Master - Sistema de Clinica

### Tarefa 1 - Violacoes encontradas

Na estrutura flat existem varios problemas:

- **1FN:** campos multivalorados, como `procedimentos`
- **2FN:** dados que dependem de partes diferentes da estrutura acabam repetidos
- **3FN:** informacoes como plano, medico e sala ficam copiadas em varias linhas, gerando dependencia transitiva e redundancia

### Tarefa 2 - Tabelas em 3FN

Uma modelagem possivel:

- `pacientes(paciente_id, nome, cpf)`
- `planos_saude(plano_id, nome, cobertura)`
- `especialidades(especialidade_id, nome)`
- `medicos(medico_id, nome, crm, especialidade_id)`
- `salas(sala_id, numero, andar)`
- `consultas(consulta_id, paciente_id, plano_id, medico_id, sala_id, data_consulta)`
- `procedimentos(procedimento_id, nome)`
- `consulta_procedimentos(consulta_id, procedimento_id)`

### Tarefa 3 - Reflexao

Se a cobertura do plano mudar de 80% para 70%, eu altero **uma unica tabela**: `planos_saude`.

Vantagem:
- evita atualizar varias linhas
- reduz inconsistencias
- facilita manutencao
- melhora a integridade dos dados

---

## Conclusao

Essa atividade mostra que normalizar nao e so organizar tabelas. E evitar duplicacao, reduzir erro e deixar o banco pronto para crescer sem bagunca.

