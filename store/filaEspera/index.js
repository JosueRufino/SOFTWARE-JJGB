// stores/filaEspera.js
import { defineStore } from 'pinia';

export const useFilaEsperaStore = defineStore('filaEspera', {
  state: () => ({
    filaCompleta: [], // Dados combinados da fila de espera com estudantes
  }),

  actions: {
    // Carregar fila de espera e estudantes apenas para um livro específico
    async fetchFilaPorLivro(livroId) {
      try {
        // Buscar apenas os registros da fila de espera para o livro específico
        const responseFila = await fetch(`http://localhost:3001/filaEspera?livro_id=${livroId}`);
        const responseEstudantes = await fetch('http://localhost:3001/estudantes');

        if (!responseFila.ok || !responseEstudantes.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }

        const filaEspera = await responseFila.json();
        const estudantes = await responseEstudantes.json();

        // Combinar os dados da fila com os dados dos estudantes
        this.filaCompleta = filaEspera.map((item) => {
          const estudante = estudantes.find((estudante) => estudante.id == item.estudante_id);
          return {
            ...item,
            estudante, // Adiciona os dados completos do estudante
          };
        });

        console.log(this.filaCompleta)
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    },

    
  },

  getters: {
    // Getter para acessar a fila de espera carregada
    filaAtual: (state) => {
      return state.filaCompleta; // Retorna os dados carregados na última busca
    },
  },
});
