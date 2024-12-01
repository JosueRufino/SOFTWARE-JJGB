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
        const responseFila = await fetch(`http://localhost:3001/filaEspera?livro_id=${livroId}`);
        const responseEstudantes = await fetch('http://localhost:3001/estudantes');

        if (!responseFila.ok || !responseEstudantes.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }

        const filaEspera = await responseFila.json();
        const estudantes = await responseEstudantes.json();

        this.filaCompleta = filaEspera.map((item) => {
          const estudante = estudantes.find((estudante) => estudante.id == item.estudante_id);
          return {
            ...item,
            estudante, // Adiciona os dados completos do estudante
          };
        });

        console.log(this.filaCompleta);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    },

    // Cadastrar uma nova pessoa na fila de espera
    async cadastrarNaFila({ livroId, estudanteId }) {
      try {
        // Determinar a próxima posição na fila
        const ultimaPosicao = this.filaCompleta.reduce((max, item) => Math.max(max, item.posicao), 0);
        const novaPosicao = ultimaPosicao + 1;

        // Dados para o novo registro na fila de espera
        const novoRegistro = {
          livro_id: livroId,
          estudante_id: estudanteId,
          posicao: novaPosicao,
          notificado: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Enviar os dados para a API
        const response = await fetch('http://localhost:3001/filaEspera', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoRegistro),
        });

        if (!response.ok) {
          throw new Error('Erro ao cadastrar na fila de espera');
        }

        const registroCriado = await response.json();

        // Atualizar o estado local com o novo registro
        this.filaCompleta.push({
          ...registroCriado,
          estudante: null, // O estudante será carregado na próxima fetchFilaPorLivro
        });

        console.log('Cadastro na fila de espera realizado com sucesso:', registroCriado);
        return registroCriado;
      } catch (error) {
        console.error('Erro ao cadastrar na fila de espera:', error);
        throw error; // Lança o erro para que a interface possa lidar com ele
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
