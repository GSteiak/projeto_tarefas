document.addEventListener("DOMContentLoaded", () => {
    const novoItemInput = document.getElementById("input-novo-item");
    const botaoAdicionarItem = document.getElementsByClassName("botao-adicionar")[0];
    const listaItens = document.getElementsByTagName("ul")[0];

    // Função para buscar tarefas do servidor
    async function buscarTarefas() {
        const response = await fetch('/tarefas');
        const tarefas = await response.json();
        listaItens.innerHTML = '';
        tarefas.forEach(tarefa => adicionarItemNaLista(tarefa));
    }

    buscarTarefas();

    novoItemInput.addEventListener("input", () => {
        if (novoItemInput.value) {
            botaoAdicionarItem.classList.remove("desativado");
            botaoAdicionarItem.disabled = false;
        } else {
            botaoAdicionarItem.classList.add("desativado");
            botaoAdicionarItem.disabled = true;
        }
    });

    botaoAdicionarItem.addEventListener("click", async (evento) => {
        evento.preventDefault();
        const resposta = await fetch('/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ texto: novoItemInput.value }),
        });
        const novaTarefa = await resposta.json();
        adicionarItemNaLista(novaTarefa);
    });

    function adicionarItemNaLista(tarefa) {
        const item = document.createElement("li");
        const input = document.createElement("input");
        input.disabled = true;
        input.value = tarefa.texto;

        const containerBotoes = document.createElement("div");
        const botaoEditar = document.createElement("button");
        const botaoApagar = document.createElement("button");

        botaoEditar.innerText = "Editar";
        botaoApagar.innerText = "Apagar";

        botaoEditar.classList.add("botao-editar");
        botaoApagar.classList.add("botao-apagar");

        botaoApagar.addEventListener("click", async () => {
            await fetch(`/tarefas/${tarefa._id}`, { method: 'DELETE' });
            item.remove();
        });

        containerBotoes.classList.add("container-botoes-editar-apagar");
        containerBotoes.append(botaoEditar);
        containerBotoes.append(botaoApagar);

        const containerBotoesSalvarCancelar = document.createElement("div");
        const botaoSalvar = document.createElement("button");
        const botaoCancelar = document.createElement("button");
        botaoSalvar.innerText = "Salvar";
        botaoCancelar.innerText = "Cancelar";
        botaoSalvar.classList.add("botao-salvar");
        botaoCancelar.classList.add("botao-cancelar");
        containerBotoesSalvarCancelar.append(botaoSalvar);
        containerBotoesSalvarCancelar.append(botaoCancelar);
        containerBotoesSalvarCancelar.classList.add("container-botoes-salvar-cancelar", "esconder-botoes");

        item.append(input);
        item.append(containerBotoes);
        item.append(containerBotoesSalvarCancelar);

        botaoEditar.addEventListener("click", () => {
            input.disabled = false;
            const fimInput = input.value.length;
            input.setSelectionRange(fimInput, fimInput);
            input.focus();

            const botoesSalvarCancelar = containerBotoesSalvarCancelar;
            botoesSalvarCancelar.classList.remove("esconder-botoes");
            containerBotoes.classList.add("esconder-botoes");

            botaoCancelar.addEventListener("click", () => {
                input.value = tarefa.texto;
                input.disabled = true;
                botoesSalvarCancelar.classList.add("esconder-botoes");
                containerBotoes.classList.remove("esconder-botoes");
            });

            botaoSalvar.addEventListener("click", async () => {
                const novaTarefa = { texto: input.value };
                const resposta = await fetch(`/tarefas/${tarefa._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(novaTarefa),
                });
                const tarefaAtualizada = await resposta.json();
                input.disabled = true;
                tarefa.texto = tarefaAtualizada.texto;
                botoesSalvarCancelar.classList.add("esconder-botoes");
                containerBotoes.classList.remove("esconder-botoes");
            });
        });

        listaItens.append(item);
        novoItemInput.value = "";
        botaoAdicionarItem.disabled = true;
        botaoAdicionarItem.classList.add("desativado");
    }
});
