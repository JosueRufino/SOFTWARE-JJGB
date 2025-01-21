// stores/funcionariosStore.js
import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useFuncionariosStore = defineStore("funcionarios", {
  state: () => ({
    funcionarios: [], // Lista de funcionários
    user: null, // Dados do usuário autenticado
  }),
  actions: {
    // Função para cadastrar novo funcionário
    async cadastrarFuncionario(novoFuncionario) {
      // Verifica se há um usuário autenticado no localStorage
      const usuarioAutenticado = JSON.parse(localStorage.getItem("user"));

      // Se não houver usuário autenticado ou o usuário autenticado não for "Admin admin", não permitir o cadastro
      if (!usuarioAutenticado || usuarioAutenticado.type !== 1) {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Sem permissão para cadastrar novo funcionário.",
        });
        throw new Error("Sem permissão para cadastrar novo funcionário");
      }

      // Valida se o email é único
      const emailExiste = this.funcionarios.some(
        (func) =>
          func.email.toLowerCase() === novoFuncionario.email.toLowerCase()
      );
      if (emailExiste) {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Este e-mail já está em uso.",
        });
        throw new Error("Este e-mail já está em uso.");
      }

      // Definir senha padrão e outras propriedades
      const funcionario = {
        ...novoFuncionario,
        id: Date.now().toString(), // Gerar um ID único
        senha: "senha123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Enviar para o json-server (se aplicável)
      try {
        const response = await fetch("http://localhost:3001/funcionarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(funcionario),
        });
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao cadastrar o funcionário.",
          });
          throw new Error("Erro ao cadastrar o funcionário.");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Ocorreu um erro ao tentar cadastrar o funcionário.",
        });
        throw error;
      }

      // Adicionar localmente (para UI)
      this.funcionarios.push(funcionario);

      // Exibir sucesso ao cadastrar
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Funcionário cadastrado com sucesso!",
      });
    },

    // Função para obter todos os funcionários
    async obterFuncionarios() {
      try {
        const response = await fetch("http://localhost:3001/funcionarios");
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao carregar os funcionários.",
          });
          throw new Error("Erro ao carregar os funcionários.");
        }

        const dados = await response.json();
        this.funcionarios = dados; // Atualiza o estado com a lista de funcionários
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Ocorreu um erro ao tentar obter os funcionários.",
        });
      }
    },

    // Função para atualizar os dados do usuário
    async atualizarDadosUsuario(updatedData) {
      // Verifica se há um usuário autenticado no localStorage
      const usuarioAutenticado = JSON.parse(localStorage.getItem("user"));
      if (!usuarioAutenticado) {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Usuário não autenticado.",
        });
        throw new Error("Usuário não autenticado");
      }

      // Atualiza os dados do usuário
      try {
        // Atualiza os dados na API
        const response = await fetch(`http://localhost:3001/funcionarios/${usuarioAutenticado.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar dados do usuário.");
        }

        const updatedFuncionario = await response.json();

        // Atualiza localStorage e state com os dados atualizados
        localStorage.setItem("user", JSON.stringify(updatedFuncionario));
        this.user = updatedFuncionario;

        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Dados do usuário atualizados com sucesso.",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro ao atualizar os dados do usuário.",
        });
      }
    },

    // Função para atualizar a senha do usuário
    async atualizarSenhaUsuario(currentPassword, newPassword) {
      // Verifica se há um usuário autenticado no localStorage
      const usuarioAutenticado = JSON.parse(localStorage.getItem("user"));
      if (!usuarioAutenticado) {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Usuário não autenticado.",
        });
        throw new Error("Usuário não autenticado");
      }

      // Verifica se a senha atual está correta
      if (usuarioAutenticado.senha !== currentPassword) {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "A senha atual está incorreta.",
        });
        throw new Error("Senha atual incorreta.");
      }

      // Atualiza a senha na API
      try {
        const response = await fetch(`http://localhost:3001/funcionarios/${usuarioAutenticado.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...usuarioAutenticado,
            senha: newPassword,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar a senha.");
        }

        const updatedFuncionario = await response.json();

        // Atualiza o usuário no localStorage e state
        localStorage.setItem("user", JSON.stringify(updatedFuncionario));
        this.user = updatedFuncionario;

        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Senha atualizada com sucesso.",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro ao atualizar a senha.",
        });
      }
    },
  },
});
