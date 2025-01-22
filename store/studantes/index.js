import { defineStore } from "pinia";

export const useStudentStore = defineStore("student", {
  state: () => ({
    students: [], // Todos os estudantes carregados
    student: null, // Estudante selecionado
    filteredStudents: [], // Estudantes filtrados
    filterByMatricula: [],
    loading: false, // Estado de carregamento
    error: null, // Mensagem de erro
    form: {
      nome: "",
      email: "",
      matricula: "",
      imagem: null,
    }, // Formulário para adicionar/editar estudantes
  }),

  getters: {
    getAllStudents: (state) => state.filteredStudents,
    getStudentById: (state) => state.student,
    getTotalStudents: (state) =>
      state.filteredStudents.length || state.students.length,
    getStudantesByMatricula: (state) => state.filterByMatricula,
  },                      

  actions: {
    // Buscar todos os estudantes
    async fetchStudents() {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch("http://localhost:3001/estudantes", {
          method: "GET",
        });
        if (response) {
          this.students = response;
          this.filteredStudents = [...this.students];
        } else {
          throw new Error("Formato de resposta inválido");
        }
      } catch (error) {
        console.error("Erro ao buscar estudantes:", error);
        this.error = error.message || "Erro ao carregar os estudantes";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar estudante por ID
    async fetchStudentById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch(
          `http://localhost:3001/estudantes/${id}`,
          {
            method: "GET",
          }
        );
        if (response) {
          this.student = response;
        }
      } catch (error) {
        console.error("Erro ao buscar estudante por ID:", error);
        this.error = error.message || "Erro ao carregar o estudante";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Filtrar por matrícula
    async filterByMatricula(matricula) {
      this.loading = true;
      try {
        const response = await $fetch("http://localhost:3001/estudantes", {
          method: "GET",
        });
        if (response) {
          const studants = response; // Dados recebidos
          console.log(studants);

          // Retorna os estudantes filtrados sem sobrescrever a função
          return studants.filter((student) => student.matricula === matricula);
        }
      } catch (error) {
        console.error("Erro ao filtrar por matrícula:", error);
        this.error = error.message || "Erro ao filtrar os estudantes";
      } finally {
        this.loading = false;
      }
    },

    async addStudent(studentData) {
      try {
        // Adicionar o estudante no estado
        this.students.push(studentData);
        this.filteredStudents.push(studentData);

        // Aqui você pode fazer a requisição para salvar no backend se necessário
        // Exemplo com fetch
        const response = await fetch("http://localhost:3001/estudantes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Estudante cadastrado com sucesso:", data);
        } else {
          console.error("Erro ao cadastrar estudante:", data);
        }
      } catch (error) {
        console.error("Erro ao adicionar estudante:", error);
      }
    },

    // Editar estudante parcialmente
    async editStudentPartial(id, updatedFields) {
      this.loading = true;
      this.error = null;
      try {
        // Envia apenas os campos que foram atualizados
        const response = await $fetch(
          `http://localhost:3001/estudantes/${id}`,
          {
            method: "PATCH", // PATCH é ideal para atualizações parciais
            body: updatedFields,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response) {
          const index = this.students.findIndex((student) => student.id === id);
          if (index !== -1) {
            // Atualiza apenas os campos editados na store
            this.students[index] = {
              ...this.students[index],
              ...updatedFields,
            };
            this.filteredStudents[index] = {
              ...this.filteredStudents[index],
              ...updatedFields,
            };
          }
        }
      } catch (error) {
        console.error("Erro ao editar estudante parcialmente:", error);
        this.error = error.message || "Erro ao editar estudante parcialmente";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // Deletar estudante
    async deleteStudent(id) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch(`http://localhost:3001/estudantes/${id}`, {
          method: "DELETE",
        });

        this.students = this.students.filter((student) => student.id !== id);
        this.filteredStudents = this.filteredStudents.filter(
          (student) => student.id !== id
        );
      } catch (error) {
        console.error("Erro ao deletar estudante:", error);
        this.error = error.message || "Erro ao deletar estudante";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Resetar formulário
    resetForm() {
      this.form = {
        nome: "",
        email: "",
        matricula: "",
        imagem: null,
      };
    },

    // Limpar filtros
    clearFilters() {
      this.filterByMatricula = [];
      this.filteredStudents = [...this.students];
    },

    // Resetar estado completamente
    resetState() {
      this.students = [];
      this.filteredStudents = [];
      this.loading = false;
      this.error = null;
      this.form = {
        nome: "",
        email: "",
        matricula: "",
        imagem: null,
      };
    },
  },
});
