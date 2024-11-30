import { defineStore } from "pinia";

export const useEmprestimosStore = defineStore("emprestimos", {
  state: () => ({
    emprestimos: [], // Lista de empréstimos combinada com os dados dos estudantes
    emprestimos2: []
  }),

  actions: {
    // Busca os empréstimos e combina com os estudantes para um livro específico
    async fetchEmprestimosPorLivro(livroId) {
      try {
        // Requisições para as coleções
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?livro_id=${livroId}`
        );
        const responseEstudantes = await fetch(
          "http://localhost:3001/estudantes"
        );

        if (!responseEmprestimos.ok || !responseEstudantes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        // Obter dados dos empréstimos e dos estudantes
        const emprestimos = await responseEmprestimos.json();
        const estudantes = await responseEstudantes.json();

        // Filtrar os empréstimos para o livroId e apenas os com status 0 (em andamento)
        const auxEm = emprestimos.filter(
          (emprestimo) => emprestimo.livro_id === 1 && emprestimo.status === 0
        ); // Filtra apenas os empréstimos em andamento (status 0);
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
        // Requisições para as coleções
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?livro_id=${livroId}`
        );
        const responseEstudantes = await fetch(
          "http://localhost:3001/estudantes"
        );

        if (!responseEmprestimos.ok || !responseEstudantes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        // Obter dados dos empréstimos e dos estudantes
        const emprestimos = await responseEmprestimos.json();
        const estudantes = await responseEstudantes.json();

        // Filtrar os empréstimos para o livroId e apenas os com status 0 (em andamento)
        const auxEm = emprestimos.filter(
          (emprestimo) => emprestimo.livro_id === 1 && emprestimo.status !== 0
        ); // Filtra apenas os empréstimos em andamento (status 0);
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
  },

  getters: {
    // Obter a lista de empréstimos, incluindo os dados dos estudantes
    emprestimosComEstudantes: (state) => state.emprestimos,
    emprestimosComEstudantes2: (state) => state.emprestimos2
  },
});
