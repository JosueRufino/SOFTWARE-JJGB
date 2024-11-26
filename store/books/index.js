export const useBookStore = defineStore("book", {
  state: () => ({
    books: [], // Todos os livros carregados
    filteredBooks: [], // Livros filtrados
    loading: false,
    error: null,
    selectedBook: null,
  }),

  getters: {
    getAllBooks: (state) => state.filteredBooks,
    getTotalBooks: (state) => state.filteredBooks.length || state.books.length,
    getAuthors: (state) => {
      // Utiliza um Set para evitar duplicados
      const authorNames = new Set(state.books.map((book) => book.autor));
      return Array.from(authorNames); // Converte o Set de volta para um array
    },
  },

  actions: {
    // Buscar todos os livros
    async fetchBooks() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch("http://localhost:3001/livros", {
          method: "GET",
        });

        if (response) {
          this.books = response;
          this.filteredBooks = [...response]; // Inicializa com todos os livros
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

    // Filtrar por autor
    filterByAuthor(authorName) {
      this.loading = true;
      try {
        console.log("Filtrando por autor:", authorName);

        if (!authorName) {
          this.filteredBooks = [...this.books];
          return;
        }

        this.filteredBooks = this.books.filter((book) => {
          const matches = book.autor
            ?.toLowerCase()
            .includes(authorName.toLowerCase());
          console.log(`Livro "${book.autor}" corresponde? ${matches}`);
          return matches;
        });

        console.log("Livros filtrados por autor:", this.filteredBooks);
      } catch (error) {
        console.error("Erro ao filtrar por autor:", error);
      } finally {
        this.loading = false;
      }
    },

    // Filtrar por status
    filterByStatus(status) {
      this.loading = true;
      try {
        console.log("Filtrando por status:", status);

        this.filteredBooks = this.books.filter((book) => {
          const matches = String(book.status) === String(status);
          console.log(
            `Status do livro: ${book.status}, corresponde ao filtro? ${matches}`
          );
          return matches;
        });

        console.log("Livros filtrados por status:", this.filteredBooks);
      } catch (error) {
        console.error("Erro ao filtrar por status:", error);
      } finally {
        this.loading = false;
      }
    },

    // Filtrar por subcategoria
    filterBySubcategory(subcategoryId) {
      this.loading = true;
      try {
        console.log("Filtrando por subcategoria:", subcategoryId);

        this.filteredBooks = this.books.filter((book) => {
          const matches =
            String(book.subcategoria_id) === String(subcategoryId);
          console.log(
            `Subcategoria do livro: ${book.subcategoria_id}, corresponde? ${matches}`
          );
          return matches;
        });

        console.log("Livros filtrados por subcategoria:", this.filteredBooks);
      } catch (error) {
        console.error("Erro ao filtrar por subcategoria:", error);
      } finally {
        this.loading = false;
      }
    },

    // Filtrar combinando múltiplos critérios
    filterBooks(params = {}) {
      this.loading = true;
      try {
        console.log("Parâmetros de filtro:", params);
        let filtered = [...this.books];

        if (params.author) {
          filtered = filtered.filter((book) => {
            const matches = book.autor
              ?.toLowerCase()
              .includes(params.author.toLowerCase());
            console.log(
              `Livro "${book.autor}" corresponde ao autor? ${matches}`
            );
            return matches;
          });
        }

        if (params.status) {
          filtered = filtered.filter((book) => {
            const matches = String(book.status) === String(params.status);
            console.log(
              `Status do livro: ${book.status}, corresponde? ${matches}`
            );
            return matches;
          });
        }

        if (params.subcategory) {
          filtered = filtered.filter((book) => {
            const matches = book.subcategoria_id === params.subcategory;
            console.log(
              `Subcategoria do livro: ${book.subcategoria_id}, corresponde? ${matches}`
            );
            return matches;
          });
        }

        this.filteredBooks = filtered;
        console.log(
          "Livros filtrados por múltiplos critérios:",
          this.filteredBooks
        );
      } catch (error) {
        console.error("Erro ao filtrar livros:", error);
      } finally {
        this.loading = false;
      }
    },

    // Limpar filtros
    clearFilters() {
      this.filteredBooks = [...this.books];
    },

    // Resetar o estado completamente
    resetState() {
      this.books = [];
      this.filteredBooks = [];
      this.loading = false;
      this.error = null;
      this.selectedBook = null;
    },
  },
});
