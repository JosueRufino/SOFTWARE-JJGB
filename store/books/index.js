// stores/book/index.js
import { defineStore } from "pinia";

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [],
    loading: false,
    error: null,
    selectedBook: null,
  }),

  getters: {
    // Retorna todos os livros
    getAllBooks: (state) => state.books,

    // Retorna o total de livros
    getTotalBooks: (state) => state.books.length,

    // Retorna livros por subcategoria
    getBooksBySubcategory: (state) => (subcategoryId) => {
      return state.books.filter(
        (book) => book.subcategoria_id === subcategoryId
      );
    },

    // Retorna livros disponíveis (quantidade > 0)
    getAvailableBooks: (state) => {
      return state.books.filter((book) => book.quantidade_disponivel > 0);
    },

    // Verifica se está carregando
    isLoading: (state) => state.loading,

    // Retorna o erro se houver
    getError: (state) => state.error,
  },

  actions: {
    // Busca todos os livros
    async fetchBooks() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch("http://localhost:3001/livros", {
          method: "GET",
        });

        if (response) {
          this.books = response;
        } else {
          throw new Error("Formato de resposta inválido");
        }
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        this.error = error.message || "Erro ao carregar os livros";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Busca um livro específico por ID
    async fetchBookById(bookId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch(`http://localhost:3001/livros/${bookId}`, {
          method: "GET",
        });

        if (response) {
          this.selectedBook = response;
          return response;
        }
        throw new Error("Livro não encontrado");
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
        this.error = error.message || "Erro ao carregar o livro";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Busca livros por subcategoria
    async fetchBooksBySubcategory(subcategoryId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch(
          `http://localhost:3001/livros/subcategorias/${subcategoryId}`,
          {
            method: "GET",
          }
        );

        if (response?.livros) {
          // Atualiza apenas os livros da subcategoria específica
          const otherBooks = this.books.filter(
            (book) => book.subcategoria_id !== subcategoryId
          );
          this.books = [...otherBooks, ...response.livros];
          return response.livros;
        }
        throw new Error("Nenhum livro encontrado para esta subcategoria");
      } catch (error) {
        console.error("Erro ao buscar livros por subcategoria:", error);
        this.error =
          error.message || "Erro ao carregar os livros da subcategoria";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Reseta o estado
    resetState() {
      this.books = [];
      this.loading = false;
      this.error = null;
      this.selectedBook = null;
    },
  },
});
