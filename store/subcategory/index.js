import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useSubcategoryStore = defineStore("subcategory", {
  state: () => ({
    subcategories: [], // Lista de subcategorias
    subcategory: null,
    subcategoriesByCategories: [],
    currentSubcategory: null, // Subcategoria atual para edição
    isLoading: false, // Controle de carregamento
  }),

  actions: {
    // Buscar todas as subcategorias
    async fetchSubcategoriesAndCategories() {
      this.isLoading = true;
      try {
        // Faz fetch das categorias e subcategorias
        const categories = await $fetch("http://localhost:3001/categories");
        const subcategories = await $fetch(
          "http://localhost:3001/subcategorias"
        );

        // Adiciona as informações completas da categoria dentro de cada subcategoria
        const subcategoriesWithCategories = subcategories.map((subcategory) => {
          const category = categories.find(
            (category) => category.id === subcategory.categoria_id.toString()
          );
          return {
            ...subcategory,
            categoria: category || null, // Inclui a categoria ou null se não for encontrada
          };
        });

        // Atualiza o estado com as subcategorias já associadas às categorias
        this.subcategories = subcategoriesWithCategories;

        console.log("Subcategorias com categorias:", this.subcategories);
      } catch (error) {
        console.error("Erro ao buscar subcategorias ou categorias:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSubcategoryId(id){
      try{
        const response = await $fetch(`http://localhost:3001/subcategorias/${id}`)
        if(response){
          this.subcategory = response
        }
      }catch(erro){
        console.log(error)
      }
    },

    // Função para buscar subcategorias de uma categoria específica
    getSubcategoriesByCategoryId(categoryId) {
      try {
        // Filtra as subcategorias com base no ID fornecido
        const filteredSubcategories = this.subcategories.filter(
          (subcat) => String(subcat.categoria_id) === categoryId
        );

        if (filteredSubcategories.length === 0) {
          console.warn(
            `Nenhuma subcategoria encontrada para a categoria ID: ${categoryId}`
          );
        }

        // Armazena as subcategorias filtradas no estado
        this.subcategoriesByCategories = filteredSubcategories;

        // Retorna sucesso com os dados
        return { success: true, data: filteredSubcategories };
      } catch (error) {
        console.error("Erro ao obter subcategorias:", error.message || error);
        return { success: false, error: error.message || error }; // Retorna o erro de forma estruturada
      }
    },

    // Adicionar nova subcategoria
    async addSubcategory(nome, categoria_id) {
      try {
        // Cria o objeto subcategoria com a estrutura correta
        const newSubcategory = {
          categoria_id: parseInt(categoria_id), // Garante que seja número
          nome: nome.trim(), // Remove espaços em branco
          createdAt: new Date().toISOString().slice(0, 19).replace("T", " "), // Formato: "2024-11-24 19:54:59"
        };

        const subcategory = await $fetch(
          "http://localhost:3001/subcategorias",
          {
            method: "POST",
            body: newSubcategory,
          }
        );

        // Adiciona a nova subcategoria à lista
        this.subcategories.push(subcategory);

        await Swal.fire({
          title: "Sucesso!",
          text: "Subcategoria adicionada com sucesso",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        return { success: true, data: subcategory };
      } catch (error) {
        console.error("Erro ao adicionar subcategoria:", error);

        await Swal.fire({
          title: "Erro!",
          text: error.message || "Erro ao adicionar subcategoria",
          icon: "error",
        });

        return {
          success: false,
          error: error.message || "Erro desconhecido",
        };
      }
    },

    async updateSubcategory(id, updatedData) {
      try {
        // Prepara os dados para atualização
        const updatePayload = {
          nome: updatedData.nome,
          categoria_id: parseInt(updatedData.categoria_id),
          // Mantém o createdAt original e atualiza o updatedAt
          updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const subcategory = await $fetch(
          `http://localhost:3001/subcategorias/${id}`,
          {
            method: "PUT",
            body: updatePayload,
          }
        );

        // Atualiza a subcategoria na lista local
        const index = this.subcategories.findIndex((sub) => sub.id === id);

        if (index !== -1) {
          this.subcategories[index] = {
            ...this.subcategories[index],
            ...subcategory,
          };
        }

        await Swal.fire({
          title: "Sucesso!",
          text: "Subcategoria atualizada com sucesso!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        return { success: true, data: subcategory };
      } catch (error) {
        console.error("Erro ao atualizar subcategoria:", error);

        await Swal.fire({
          title: "Erro!",
          text: error.message || "Erro ao atualizar subcategoria",
          icon: "error",
          showConfirmButton: true,
        });

        return {
          success: false,
          error: error.message || "Erro desconhecido",
        };
      }
    },
    // Deletar subcategoria
    async deleteSubcategory(subcategoryId) {
      try {
        const confirmation = await Swal.fire({
          title: "Você tem certeza?",
          text: "Esta ação não pode ser desfeita.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sim, deletar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        });

        if (confirmation.isConfirmed) {
          // Verifica se o ID é válido
          if (
            !subcategoryId ||
            (typeof subcategoryId !== "number" &&
              typeof subcategoryId !== "string")
          ) {
            throw new Error("ID da subcategoria inválido.");
          }

          try {
            // Requisição para deletar a subcategoria
            const response = await $fetch(
              `http://localhost:3001/subcategories/${subcategoryId}`,
              {
                method: "DELETE",
              }
            );

            // Verifica se a resposta foi bem-sucedida
            if (!response && typeof response !== "undefined") {
              throw new Error("Falha na resposta do servidor");
            }

            // Remove a subcategoria localmente apenas se a deleção foi bem-sucedida
            this.subcategories = this.subcategories.filter(
              (sub) => sub.id !== subcategoryId
            );

            await Swal.fire({
              title: "Sucesso!",
              text: "Subcategoria eliminada com sucesso!",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            });

            return { success: true };
          } catch (error) {
            // Tratamento específico para erro 404
            if (error.response?.status === 404) {
              throw new Error(
                "Subcategoria não encontrada. Ela pode já ter sido deletada."
              );
            }

            // Outros erros de rede ou servidor
            throw new Error(
              error.message || "Erro ao comunicar com o servidor"
            );
          }
        } else {
          await Swal.fire({
            title: "Cancelado",
            text: "A subcategoria não foi deletada.",
            icon: "info",
            showConfirmButton: false,
            timer: 1500,
          });
          return { success: false, canceled: true };
        }
      } catch (error) {
        console.error("Erro ao deletar subcategoria:", error);

        await Swal.fire({
          title: "Erro!",
          text: error.message || "Erro desconhecido ao eliminar subcategoria.",
          icon: "error",
          showConfirmButton: true,
        });

        return { success: false, error: error.message };
      }
    },

    // Selecionar subcategoria para edição
    selectSubcategory(subcategory) {
      this.currentSubcategory = subcategory;
    },
  },
});
