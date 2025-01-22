<template>
  <div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="listaEsperaModal"
      tabindex="-1"
      aria-labelledby="listaEsperaModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="listaEsperaModalLabel">
              Adicionar na Lista de Espera
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="adicionarNaListaEspera">
            <div class="modal-body">
              <!-- Dados do Livro -->
              <fieldset class="mb-3">
                <legend>Dados do Livro</legend>
                <div class="row">
                  <div class="mb-3 col">
                    <label for="nomeLivro" class="form-label"
                      >Nome do Livro</label
                    >
                    <input
                      type="text"
                      id="nomeLivro"
                      v-model="form.nomeLivro"
                      class="form-control"
                      required
                      disabled
                    />
                  </div>
                  <div class="mb-3 col">
                    <label for="isbn" class="form-label">ISBN</label>
                    <input
                      type="text"
                      id="isbn"
                      v-model="form.isbn"
                      class="form-control"
                      required
                      disabled
                    />
                  </div>
                </div>
              </fieldset>

              <div class="mb-3">
                <button type="button" class="btn btn-secondary" @click="fbook">
                  Buscar Livro
                </button>
              </div>

              <!-- Dados do Estudante -->
              <fieldset class="mb-3">
                <legend>Dados do Estudante</legend>
                <div class="row">
                  <div class="mb-3 col">
                    <label for="numeroMatricula" class="form-label"
                      >Número de Matrícula</label
                    >
                    <input
                      type="text"
                      id="numeroMatricula"
                      v-model="form.numeroMatricula"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3 col">
                    <label for="nomeEstudante" class="form-label"
                      >Nome do Estudante</label
                    >
                    <input
                      type="text"
                      id="nomeEstudante"
                      v-model="form.nomeEstudante"
                      class="form-control"
                      disabled
                    />
                  </div>
                </div>
              </fieldset>

              <div class="mb-3">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="buscarEstudantePorMatricula"
                >
                  Buscar Estudante
                </button>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                Adicionar na Lista de Espera
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useBookStore } from "@/store/books/index";
import { useStudentStore } from "@/store/studantes/index";
import { useFilaEsperaStore } from "@/store/filaEspera/index"; // Importa o store da fila de espera
import { useRoute } from "vue-router";

const useBook = useBookStore();
const useEstudante = useStudentStore();
const filaEsperaStore = useFilaEsperaStore(); // Instancia o store da fila de espera
const route = useRoute();
const estudanteId = ref(0); // Armazena o ID do estudante como número

const dataBook = computed(() => useBook.getBookId);

const form = ref({
  nomeLivro: dataBook.value?.titulo,
  isbn: "",
  numeroMatricula: "",
  nomeEstudante: "",
});

// Função para buscar os dados do livro
const fbook = async () => {
  await useBook.fetchBookById(Number(route.query.livroId)); // Garante que livroId seja numérico
};

// Função para buscar os dados do estudante pela matrícula
async function buscarEstudantePorMatricula() {
  const matricula = form.value.numeroMatricula;

  if (!matricula) {
    form.value.nomeEstudante = "";
    useEstudante.clearFilters();
    return;
  }

  try {
    await useEstudante.fetchStudents();
    console.log("Estudantes carregados:", useEstudante.students);

    await useEstudante.filterByMatricula(matricula);
    const estudante = useEstudante.getStudantesByMatricula;
    console.log("Estudante filtrado:", estudante);

    if (estudante && estudante.length > 0) {
      form.value.nomeEstudante = estudante[0].nome;
      estudanteId.value = Number(estudante[0].id);
      Swal.fire({
        icon: "success",
        title: "Estudante encontrado!",
        text: `Nome: ${estudante[0].nome}`,
      });
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
    Swal.fire({
      icon: "error",
      title: "Erro ao buscar estudante",
      text: "Verifique a matrícula ou tente novamente.",
    });
    form.value.nomeEstudante = "";
  }
}

const fila = computed(() => filaEsperaStore.filaAtual);

// Função para adicionar o estudante na lista de espera
async function adicionarNaListaEspera() {
  console.log("filssa", fila.value);
  filaEsperaStore.fetchFilaPorLivro(1);
  if (!estudanteId.value) {
    Swal.fire({
      icon: "error",
      title: "Estudante não selecionado",
      text: "Busque o estudante antes de adicionar à lista de espera.",
    });
    return;
  }
  console.log(
    "verify",
    await filaEsperaStore.verify(route.query.livroId, estudanteId.value)
  );
  if (!(await filaEsperaStore.verify(route.query.livroId, estudanteId.value))) {
    const novoRegistro = await filaEsperaStore.cadastrarNaFila({
      livroId: Number(route.query.livroId),
      estudanteId: estudanteId.value,
    });

    Swal.fire({
      icon: "success",
      title: "Adicionado na lista de espera",
      text: `O estudante foi incluído com sucesso na posição: ${novoRegistro.posicao}`,
    });

    resetarFormulario();

    fecharModal();
  } else {
    Swal.fire({
      title: "Aviso",
      text: "Aluno já se encontra na fila por este livro",
      icon: "warning",
      showConfirmButton: false,
      timer: 2000,
    });
  }
}

// Função para resetar o formulário
function resetarFormulario() {
  form.value = {
    nomeLivro: dataBook.value?.titulo,
    isbn: dataBook.value?.isbn,
    numeroMatricula: "",
    nomeEstudante: "",
  };
  estudanteId.value = 0;
}

// Função para fechar o modal
function fecharModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("listaEsperaModal")
  );
  if (modal) modal.hide();
}

onMounted(async () => {
  await filaEsperaStore.fetchFilaPorLivro(Number(route.query.livroId));
  await useBook.fetchBookById(Number(route.query.livroId));
});

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
