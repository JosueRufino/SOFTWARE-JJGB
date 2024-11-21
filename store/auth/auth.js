import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // Armazenar os dados do usuário autenticado
  }),

  actions: {
    // Função para realizar o login
    async login(email, password) {
      try {
        // Chama a API para verificar o funcionário com email e senha
        const response = await $fetch("http://localhost:3001/funcionarios", {
          method: "GET",
          query: { email, password },
        });

        if (response.length > 0) {
          this.user = response[0];
        } else {
          throw new Error("Credenciais inválidas");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw new Error("Erro ao fazer login");
      }
    },

    // Função para fazer logout
    logout() {
      this.user = null; // Limpa os dados do usuário
    },
  },
});
