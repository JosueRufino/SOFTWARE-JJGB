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
          return studants.filter((student) =>
            student.matricula.includes(matricula)
          );
        }
      } catch (error) {
        console.error("Erro ao filtrar por matrícula:", error);
        this.error = error.message || "Erro ao filtrar os estudantes";
      } finally {
        this.loading = false;
      }
    },
    
    // Adicionar novo estudante
    async addStudent() {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append("nome", this.form.nome);
        formData.append("email", this.form.email);
        formData.append("matricula", this.form.matricula);
        if (this.form.imagem) {
          formData.append("imagem", this.form.imagem);
        }

        const response = await $fetch("http://localhost:3001/estudantes", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response) {
          this.students.push(response);
          this.filteredStudents.push(response);
          this.resetForm();
        }
      } catch (error) {
        console.error("Erro ao adicionar estudante:", error);
        this.error = error.message || "Erro ao adicionar estudante";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Editar estudante
    async editStudent(id) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append("nome", this.form.nome);
        formData.append("email", this.form.email);
        formData.append("matricula", this.form.matricula);
        if (this.form.imagem) {
          formData.append("imagem", this.form.imagem);
        }

        const response = await $fetch(
          `http://localhost:3001/estudantes/${id}`,
          {
            method: "PUT",
            body: formData,
            headers: { Accept: "application/json" },
          }
        );

        if (response) {
          const index = this.students.findIndex((student) => student.id === id);
          if (index !== -1) {
            this.students[index] = response;
            this.filteredStudents[index] = response;
          }
        }
      } catch (error) {
        console.error("Erro ao editar estudante:", error);
        this.error = error.message || "Erro ao editar estudante";
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
