import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // Armazenar os dados do usuário autenticado
  }),

  actions: {
    async login(email, password) {
      if (!email || !password) {
        return { success: false, message: "E-mail e senha são obrigatórios" };
      }

      try {
        // Busca os dados do usuário com o email fornecido
        const response = await $fetch("http://localhost:3001/funcionarios", {
          method: "GET",
          query: { email },
        });
        console.log("user");
        // Verifica se encontrou algum usuário com o email fornecido
        if (response && response.length > 0) {
          const user = response[0]; // Pega o primeiro usuário encontrado

          // Verifica se a senha fornecida é igual à senha do usuário encontrado
          if (user.senha === password) {
            this.user = user;

            // Armazena no localStorage apenas se estiver no navegador
            if (typeof window !== "undefined" && window.localStorage) {
              localStorage.setItem("user", JSON.stringify(this.user));
            }

            return { success: true, message: "Login realizado com sucesso" };
          } else {
            return { success: false, message: "Senha incorreta" };
          }
        } else {
          return { success: false, message: "E-mail não encontrado" };
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        return {
          success: false,
          message: "Erro ao conectar ao servidor. Tente novamente.",
        };
      }
    },

    logout() {
      this.user = null;

      // Remove do localStorage apenas se estiver no navegador
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("user");
      }
    },
  },
});
