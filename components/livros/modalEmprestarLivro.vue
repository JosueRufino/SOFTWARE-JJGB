<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="emprestimoModal" tabindex="-1" aria-labelledby="emprestimoModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="emprestimoModalLabel">
              Realizar Empréstimo
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="finalizarEmprestimo">
            <div class="modal-body">
              <!-- Dados do Livro -->
              <fieldset class="mb-3">
                <legend>Dados do Livro</legend>
                <div class="row">
                  <div class="mb-3 col">
                    <label for="nomeLivro" class="form-label">Nome do Livro</label>
                    <input type="text" id="nomeLivro" v-model="form.nomeLivro" class="form-control" required disabled />
                  </div>
                  <div class="mb-3 col">
                    <label for="isbn" class="form-label">ISBN</label>
                    <input type="text" id="isbn" v-model="form.isbn" class="form-control" required disabled />
                  </div>
                </div>
              </fieldset>
              <div class="mb-3">
                <button type="button" class="btn btn-secondary" @click="fbook">Buscar Livro</button>
              </div>

              <!-- Dados do Estudante -->
              <fieldset class="mb-3">
                <legend>Dados do Estudante</legend>
                <div class="row">
                  <div class="mb-3 col">
                    <label for="numeroMatricula" class="form-label">Número de Matrícula</label>
                    <input type="text" id="numeroMatricula" v-model="form.numeroMatricula" class="form-control"
                      required />
                  </div>
                  <div class="mb-3 col">
                    <label for="nomeEstudante" class="form-label">Nome do Estudante</label>
                    <input type="text" id="nomeEstudante" v-model="form.nomeEstudante" class="form-control" disabled />
                  </div>
                </div>
              </fieldset>

              <!-- Botão para buscar estudante manualmente -->
              <div class="mb-3">
                <button type="button" class="btn btn-secondary" @click="buscarEstudantePorMatricula">Buscar
                  Estudante</button>
              </div>

              <!-- Dados Extras -->
              <fieldset>
                <legend>Dados do Extras</legend>
                <div class="row">
                  <div class="mb-3 col">
                    <label for="dataEmprestimo" class="form-label">Data do Empréstimo</label>
                    <input type="date" id="dataEmprestimo" v-model="form.dataEmprestimo" class="form-control" required
                      disabled />
                  </div>
                  <div class="mb-3 col">
                    <label for="dataDevolucao" class="form-label">Data para Devolução</label>
                    <input type="date" id="dataDevolucao" v-model="form.dataDevolucao" class="form-control" required
                      disabled />
                  </div>
                </div>
              </fieldset>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Finalizar Empréstimo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useBookStore } from "@/store/books/index";
import { useStudentStore } from "@/store/studantes/index";
import { useEmprestimosStore } from "@/store/emprestimo/index";
import { useRoute } from "vue-router";
import Swal from "sweetalert2"; // Importando SweetAlert2

const useBook = useBookStore();
const useEstudante = useStudentStore();
const useEmprestimos = useEmprestimosStore();
const route = useRoute();
const estudanteId = ref("");

const dataBook = computed(() => useBook.getBookId);

const form = ref({
  idLivro: dataBook.value?.id,
  nomeLivro: dataBook.value?.titulo,
  isbn: "",
  numeroMatricula: "",
  nomeEstudante: "",
  dataEmprestimo: "",
  dataDevolucao: "",
});

const fbook = async () => {
  await useBook.fetchBookById(route.query.livroId);
};

// Função para definir a data de empréstimo como a data de hoje
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Função para definir a data de devolução como 3 dias após o empréstimo
function getReturnDate() {
  const today = new Date();
  today.setDate(today.getDate() + 3);
  return today.toISOString().split("T")[0];
}

// Atualizando as datas automaticamente ao montar o componente
onMounted(async () => {
  await useBook.fetchBookById(route.query.livroId);
  form.value.dataEmprestimo = getTodayDate();
  form.value.dataDevolucao = getReturnDate();

  const modalElement = document.getElementById("emprestimoModal");
  modalElement.addEventListener("hidden.bs.modal", resetForm);
});

// Função para resetar os dados do formulário
function resetForm() {
  form.value = {
    idLivro: dataBook.value?.id,
    nomeLivro: dataBook.value?.titulo,
    isbn: "",
    numeroMatricula: "",
    nomeEstudante: "",
    dataEmprestimo: getTodayDate(),
    dataDevolucao: getReturnDate(),
  };
}

// Função de busca de estudante
async function buscarEstudantePorMatricula() {
  const matricula = form.value.numeroMatricula;

  if (!matricula) {
    form.value.nomeEstudante = "";
    useEstudante.clearFilters();
    Swal.fire({
      icon: "warning",
      title: "Atenção",
      text: "Por favor, insira o número de matrícula.",
    });
    return;
  }

  try {
    await useEstudante.fetchStudents();
    await useEstudante.filterByMatricula(matricula);

    const estudante = useEstudante.getStudantesByMatricula;
    if (estudante && estudante.length > 0) {
      form.value.nomeEstudante = estudante[0].nome;
      estudanteId.value = estudante[0].id;
    } else {
      form.value.nomeEstudante = "";
      Swal.fire({
        icon: "error",
        title: "Estudante não encontrado",
        text: "Verifique o número de matrícula e tente novamente.",
      });
    }
  } catch (error) {
    console.error("Erro ao buscar o estudante:", error);
    form.value.nomeEstudante = "";
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao buscar o estudante. Tente novamente.",
    });
  }
}

// Função para finalizar o empréstimo
async function finalizarEmprestimo() {
  const dadosCadastro = {
    livro_id: parseInt(route.query.livroId, 10),
    estudante_id: parseInt(estudanteId.value, 10),
    data_emprestimo: form.value.dataEmprestimo,
    data_devolucao: form.value.dataDevolucao,
    data_devolvida: null,
    status: 0,
  };

  try {
    if (dataBook.value.quantidade_disponivel - 1 === 0) {
      const updatedData = {
        id: parseInt(dataBook.value.id, 10),
        titulo: dataBook.value.titulo,
        descricao: dataBook.value.descricao,
        autor: dataBook.value.autor,
        imagem: dataBook.value.imagem,
        isbn: dataBook.value.isbn,
        ano_publicacao: parseInt(dataBook.value.ano_publicacao, 10),
        quantidade_total: parseInt(dataBook.value.quantidade_total, 10),
        quantidade_disponivel: 0,
        subcategoria_id: parseInt(dataBook.value.subcategoria_id, 10),
        status: false,
        createdAt: dataBook.value.createdAt,
        updatedAt: new Date().toISOString(),
      };
      await useBook.updateBook(dataBook.value.id, updatedData);
    } else {
      const updatedData = {
        id: parseInt(dataBook.value.id, 10),
        titulo: dataBook.value.titulo,
        descricao: dataBook.value.descricao,
        autor: dataBook.value.autor,
        imagem: dataBook.value.imagem,
        isbn: dataBook.value.isbn,
        ano_publicacao: parseInt(dataBook.value.ano_publicacao, 10),
        quantidade_total: parseInt(dataBook.value.quantidade_total, 10),
        quantidade_disponivel:
          parseInt(dataBook.value.quantidade_disponivel, 10) - 1,
        subcategoria_id: parseInt(dataBook.value.subcategoria_id, 10),
        status: dataBook.value.status,
        createdAt: dataBook.value.createdAt,
        updatedAt: new Date().toISOString(),
      };
      await useBook.updateBook(dataBook.value.id, updatedData);
    }

    await useEmprestimos.cadastrarEmprestimo(dadosCadastro);

    Swal.fire({
      icon: "success",
      title: "Empréstimo realizado",
      text: "O empréstimo foi cadastrado com sucesso!",
    });

    resetForm();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("emprestimoModal")
    );
    modal.hide();
  } catch (error) {
    console.error("Erro ao cadastrar o empréstimo:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao realizar o empréstimo. Tente novamente.",
    });
  }
}

// Atualiza os dados do formulário quando o livro é carregado
watch(
  dataBook,
  (newData) => {
    if (newData) {
      form.value.nomeLivro = newData.titulo;
      form.value.isbn = newData.isbn || "";
    }
  },
  { immediate: true }
);
</script>
