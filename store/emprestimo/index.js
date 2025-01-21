import { defineStore } from "pinia";

export const useEmprestimosStore = defineStore("emprestimos", {
  state: () => ({
    emprestimos: [], // Lista de empréstimos combinada com os dados dos estudantes
    emprestimos2: [],
    emprestimosPorEstudante: [], // Lista de empréstimos de um estudante específico
  }),

  getters: {
    emprestimosComEstudantes: (state) => state.emprestimos,
    emprestimosComEstudantes2: (state) => state.emprestimos2,
    emprestimosDoEstudante: (state) => state.emprestimosPorEstudante,
  },

  actions: {
    // Busca os empréstimos e combina com os estudantes para um livro específico
    async fetchEmprestimosPorLivro(livroId) {
      try {
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?livro_id=${livroId}`
        );
        const responseEstudantes = await fetch(
          "http://localhost:3001/estudantes"
        );

        if (!responseEmprestimos.ok || !responseEstudantes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const emprestimos = await responseEmprestimos.json();
        const estudantes = await responseEstudantes.json();

        const auxEm = emprestimos.filter(
          (emprestimo) => emprestimo.livro_id === 1 && emprestimo.status === 0
        );

        this.emprestimos = auxEm.map((item) => {
          const estudante = estudantes.find(
            (estudante) => estudante.id == item.estudante_id
          );
          return {
            ...item,
            estudante,
          };
        });
        console.log("Empréstimos para o livro (status 0):", this.emprestimos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    async fetchEmprestimosPorLivroOthers(livroId) {
      try {
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?livro_id=${livroId}`
        );
        const responseEstudantes = await fetch(
          "http://localhost:3001/estudantes"
        );

        if (!responseEmprestimos.ok || !responseEstudantes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const emprestimos = await responseEmprestimos.json();
        const estudantes = await responseEstudantes.json();

        const auxEm = emprestimos.filter(
          (emprestimo) =>
            emprestimo.livro_id === livroId && emprestimo.status !== 0
        );

        this.emprestimos2 = auxEm.map((item) => {
          const estudante = estudantes.find(
            (estudante) => estudante.id == item.estudante_id
          );
          return {
            ...item,
            estudante,
          };
        });
        console.log("Empréstimos para o livro (status 0):", this.emprestimos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    async fetchEmprestimosPorEstudante(estudanteId) {
      try {
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?estudante_id=${estudanteId}`
        );
        const responseLivros = await fetch("http://localhost:3001/livros");

        if (!responseEmprestimos.ok || !responseLivros.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const emprestimos = await responseEmprestimos.json();
        const livros = await responseLivros.json();

        const auxEm = emprestimos.filter(
          (emprestimo) => emprestimo.status !== 0
        );

        this.emprestimosPorEstudante = auxEm.map((item) => {
          const livro = livros.find((livro) => livro.id == item.livro_id);
          return {
            ...item,
            livro,
          };
        });

        console.log(
          "Empréstimos para o estudante (status != 0):",
          this.emprestimosPorEstudante
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    async editarEmprestimo(emprestimoId, dadosAtualizados) {
      try {
        // Verifica se os dados atualizados têm pelo menos uma propriedade
        if (Object.keys(dadosAtualizados).length === 0) {
          throw new Error("Nenhum dado para atualizar foi fornecido.");
        }

        // Envia os dados atualizados para a API usando PATCH
        const response = await fetch(
          `http://localhost:3001/emprestimos/${emprestimoId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosAtualizados),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao atualizar o empréstimo.");
        }

        // Atualiza o estado local com os dados retornados pela API
        const emprestimoAtualizado = await response.json();
        const index = this.emprestimos.findIndex(
          (item) => item.id === emprestimoId
        );
        if (index !== -1) {
          this.emprestimos[index] = {
            ...this.emprestimos[index],
            ...emprestimoAtualizado,
          };
        }

        console.log("Empréstimo atualizado com sucesso:", emprestimoAtualizado);
      } catch (error) {
        console.error("Erro ao atualizar o empréstimo:", error);
      }
    },

    // Função para cadastrar um novo empréstimo
    async cadastrarEmprestimo(novoEmprestimo) {
      try {
        // Envia os dados para a API para cadastrar o empréstimo
        const response = await fetch("http://localhost:3001/emprestimos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoEmprestimo),
        });

        if (!response.ok) {
          throw new Error("Erro ao cadastrar o empréstimo");
        }

        // Atualiza o estado local com o novo empréstimo, após o cadastro com sucesso
        const emprestimoCadastrado = await response.json();
        this.emprestimos.push(emprestimoCadastrado);

        // Opcionalmente, você pode adicionar o estudante à lista de empréstimos, se necessário
        console.log(
          "Novo empréstimo cadastrado com sucesso:",
          emprestimoCadastrado
        );
      } catch (error) {
        console.error("Erro ao cadastrar o empréstimo:", error);
      }
    },
    // Função para listar os empréstimos pendentes (status 0) de um estudante
    async fetchEmprestimosPendentesPorEstudante(estudanteId) {
      try {
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?estudante_id=${estudanteId}`
        );
        const responseLivros = await fetch("http://localhost:3001/livros");

        if (!responseEmprestimos.ok || !responseLivros.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const emprestimos = await responseEmprestimos.json();
        const livros = await responseLivros.json();

        // Filtra apenas os empréstimos com status 0 (pendentes)
        const emprestimosPendentes = emprestimos.filter(
          (item) => item.status === 0
        );

        // Combina os dados dos empréstimos pendentes com os livros
        this.emprestimosPorEstudante = emprestimosPendentes.map((item) => {
          const livro = livros.find((livro) => livro.id == item.livro_id);
          return {
            ...item,
            livro,
          };
        });

        console.log(
          `Empréstimos pendentes (status 0) do estudante ${estudanteId}:`,
          this.emprestimosPorEstudante
        );
      } catch (error) {
        console.error("Erro ao carregar dados dos empréstimos:", error);
      }
    },
  },
});
