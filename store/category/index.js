import { defineStore } from "pinia";
import Swal from "sweetalert2";
export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    currentCategory: null, // Categoria atual para edição
    isLoading: false, // Controle de carregamento
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await $fetch("http://localhost:3001/categories");
        this.categories = response;
        console.log(response, "response");
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // Buscar uma única subcategoria pelo ID
    async fetchCategoryById(id) {
      this.isLoading = true;
      try {
        const response = await fetch(`http://localhost:3001/categories/${id}`);

        this.currentCategory = response;
        console.log(response, "categoria carregada com sucesso");
        return response;
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async addCategory(newCategory, date) {
      try {
        const category = await $fetch("http://localhost:3001/categories", {
          method: "POST",
          body: { nome: newCategory, createdAt: date },
        });
        this.categories.push(category); // Atualiza a lista local
        return { success: true }; // Retorna sucesso
      } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
        return {
          success: false,
          message: error.message || "Erro desconhecido",
        }; // Retorna o erro
      }
    },
    async updateCategory(updatedCategory) {
      try {
        // Enviando solicitação PUT para atualizar a categoria no backend
        const category = await $fetch(
          `http://localhost:3001/categories/${updatedCategory.id}`,
          {
            method: "PUT",
            body: updatedCategory,
          }
        );

        // Encontrar o índice da categoria atualizada
        const index = this.categories.findIndex(
          (cat) => cat.id === updatedCategory.id
        );

        // Se a categoria for encontrada, atualize a lista local de categorias
        if (index !== -1) {
          this.categories[index] = category; // Atualiza a categoria na lista local
        }

        // Exibe uma mensagem de sucesso usando SweetAlert
        Swal.fire({
          title: "Sucesso!",
          text: "Categoria atualizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        console.error("Erro ao atualizar categoria:", error);

        // Exibe uma mensagem de erro usando SweetAlert
        Swal.fire({
          title: "Erro!",
          text: "Houve um erro ao atualizar a categoria.",
          icon: "error",
          showConfirmButton: true,
        });
      }
    },
    // Excluir categoria
    async deleteCategory(categoryId) {
      try {
        // Confirmar com o usuário antes de deletar
        const confirmation = await Swal.fire({
          title: "Você tem certeza?",
          text: "Esta ação não pode ser desfeita.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sim, deletar",
          cancelButtonText: "Cancelar",
          reverseButtons: true, // Para inverter a posição dos botões
        });

        if (confirmation.isConfirmed) {
          // Verifica se o ID é válido
          if (
            typeof categoryId !== "number" &&
            typeof categoryId !== "string"
          ) {
            throw new Error("ID da categoria inválido.");
          }

          // Requisição para deletar a categoria
          await $fetch(`http://localhost:3001/categories/${categoryId}`, {
            method: "DELETE",
          });

          // Remove a categoria localmente após a exclusão no backend
          this.categories = this.categories.filter(
            (cat) => cat.id !== categoryId
          );

          // Exibir mensagem de sucesso
          Swal.fire({
            title: "Sucesso!",
            text: "Categoria eliminada com sucesso!",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          // Caso o usuário cancele
          Swal.fire({
            title: "Cancelado",
            text: "A categoria não foi deletada.",
            icon: "info",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);

        // Exibir mensagem de erro
        Swal.fire({
          title: "Erro!",
          text: error.message || "Erro desconhecido ao eliminar categoria.",
          icon: "error",
          showConfirmButton: true,
        });
      }
    },

    // Selecionar categoria para edição
    selectCategory(category) {
      this.currentCategory = category;
    },
  },
});
