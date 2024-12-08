<script setup>
import { defineProps, ref, watch } from "vue";
import { useEmprestimosStore } from "../../store/emprestimo/index";
import { useStudentStore } from "../../store/studantes/index";
import { useBookStore } from "../../store/books/index";
import Swal from "sweetalert2";

// Define a prop to receive the loan
const props = defineProps({
  emprestimo: {
    type: Object,
    default: null,
  },
});

// Use a local ref for the loan
const localEmprestimo = ref(null);
const penalidade = ref(false);
const emprestimo = useEmprestimosStore();
const studant = useStudentStore();
const books = useBookStore();
// Watch for changes in the prop
watch(
  () => props.emprestimo,
  (newValue) => {
    localEmprestimo.value = newValue;
    penalidade.value = false; // Reset penalty flag
  }
);

// Method to format date
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  const dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (includeTime) {
    dateOptions.hour = "2-digit";
    dateOptions.minute = "2-digit";
  }

  return date.toLocaleString("pt-BR", dateOptions);
};

// Calculate days between dates
const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const st = computed(() => studant.getStudentById);

// Função para confirmar a devolução
const confirmarDevolucao = async () => {
  if (localEmprestimo.value) {
    try {
      const dataAtual = new Date();
      const dataDevolucao = new Date(localEmprestimo.value.data_devolucao);
      localEmprestimo.value.status = 1; // Status devolvido
      localEmprestimo.value.data_devolvida = dataAtual.toISOString();

      penalidade.value = dataAtual > dataDevolucao; // Define penalidade

      // Atualiza os dados do estudante
      await studant.fetchStudentById(localEmprestimo.value.estudante_id);

      if (penalidade.value) {
        const penalidadeFields = {
          penality: penalidade.value,
          data_penalidade: localEmprestimo.value.data_devolvida,
        };
        await studant.editStudentPartial(
          localEmprestimo.value.estudante_id,
          penalidadeFields
        );
      }

      const updatedFields = {
        livros: st.value.livros - 1,
      };
      await studant.editStudentPartial(
        localEmprestimo.value.estudante_id,
        updatedFields
      );

      // Atualiza o empréstimo
      await emprestimo.editarEmprestimo(localEmprestimo.value.id, {
        status: 1,
        data_devolvida: localEmprestimo.value.data_devolvida,
      });

      // Atualiza o livro
      const dataBook = {
        quantidade_disponivel:
          localEmprestimo.value?.livro.quantidade_disponivel + 1,
      };
      await books.updateBookPartial(localEmprestimo.value?.livro.id, dataBook);

      // Exibe a mensagem de sucesso
      Swal.fire({
        icon: "success",
        title: "Devolução confirmada!",
        text: "O livro foi devolvido com sucesso.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Fecha o modal
      const modalElement = document.getElementById("validarDevolucao");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      // Aguarda o timer e recarrega a página
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      // Exibe mensagem de erro
      Swal.fire({
        icon: "error",
        title: "Erro na devolução",
        text: "Não foi possível completar a devolução. Tente novamente.",
      });
    }
  }
};

</script>

<template>
  <div
    class="modal fade"
    id="validarDevolucao"
    tabindex="-1"
    aria-labelledby="validarDevolucaoLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="validarDevolucaoLabel">
            <i class="bi bi-book me-2"></i>Devolução do Livro
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="localEmprestimo" class="row">
            <div class="col-md-4 text-center mb-3">
              <img
                v-if="localEmprestimo.livro.imagem"
                :src="localEmprestimo.livro.imagem"
                alt="Capa do Livro"
                class="img-fluid rounded shadow-sm max-height-300"
              />
              <div
                v-else
                class="bg-light d-flex justify-content-center align-items-center rounded shadow-sm max-height-300"
              >
                <p class="text-muted">Sem imagem disponível</p>
              </div>
            </div>
            <div class="col-md-8">
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title text-primary mb-3">
                    Detalhes do Empréstimo
                    {{ localEmprestimo.livro.id }}
                  </h6>
                  <div class="row mb-2">
                    <div class="col-6">
                      <strong>Livro:</strong>
                      <p class="text-truncate">
                        {{ localEmprestimo.livro.titulo }}
                      </p>
                    </div>
                    <div class="col-6">
                      <strong>Autor:</strong>
                      <p class="text-truncate">
                        {{ localEmprestimo.livro.autor }}
                      </p>
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-6">
                      <strong>ISBN:</strong>
                      <p>{{ localEmprestimo.livro.isbn }}</p>
                    </div>
                    <div class="col-6">
                      <strong>Ano de Publicação:</strong>
                      <p>{{ localEmprestimo.livro.ano_publicacao }}</p>
                    </div>
                  </div>
                  <div class="mt-3">
                    <strong>Descrição:</strong>
                    <p class="text-muted fst-italic">
                      {{ localEmprestimo.livro.descricao || "Sem descrição" }}
                    </p>
                  </div>
                  <div class="card bg-light mb-3">
                    <div class="card-body py-2">
                      <div class="row">
                        <div class="col-6">
                          <small class="text-muted">Data do Empréstimo:</small>
                          <p class="mb-0">
                            {{
                              formatDate(localEmprestimo.data_emprestimo, true)
                            }}
                          </p>
                        </div>
                        <div class="col-6">
                          <small class="text-muted"
                            >Data de Devolução Prevista:</small
                          >
                          <p class="mb-0">
                            {{
                              formatDate(localEmprestimo.data_devolucao, true)
                            }}
                          </p>
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-6">
                          <small class="text-muted"
                            >Período do Empréstimo:</small
                          >
                          <p class="mb-0">
                            {{
                              calculateDaysBetween(
                                localEmprestimo.data_emprestimo,
                                localEmprestimo.data_devolucao
                              )
                            }}
                            dias
                          </p>
                        </div>

                        <div class="col-6">
                          <small class="text-muted"
                            >Data de Devolução Atual:</small
                          >
                          <p class="mb-0">
                            {{ formatDate(new Date().toISOString(), true) }}
                          </p>
                        </div>
                      </div>

                      <!-- Mostrar status da devolução -->
                      <div class="row mt-2">
                        <div class="col-12">
                          <div
                            class="alert"
                            :class="{
                              'alert-danger':
                                formatDate(
                                  localEmprestimo.data_devolucao,
                                  true
                                ) <= formatDate(new Date().toISOString(), true),
                              'alert-success':
                                formatDate(
                                  localEmprestimo.data_devolucao,
                                  true
                                ) > formatDate(new Date().toISOString(), true),
                            }"
                          >
                            <i
                              :class="{
                                'bi bi-exclamation-triangle':
                                  formatDate(
                                    localEmprestimo.data_devolucao,
                                    true
                                  ) <=
                                  formatDate(new Date().toISOString(), true),
                                'bi bi-check-circle':
                                  formatDate(
                                    localEmprestimo.data_devolucao,
                                    true
                                  ) >
                                  formatDate(new Date().toISOString(), true),
                              }"
                              class="me-2"
                            ></i>
                            {{
                              formatDate(localEmprestimo.data_devolucao, true) <
                              formatDate(new Date().toISOString(), true)
                                ? "Atenção: Devolução em atraso. Penalidade aplicada."
                                : "Devolução dentro do prazo. Obrigado!"
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="alert alert-danger" v-if="penalidade">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Atenção: Devolução em atraso. Penalidade aplicada.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando dados do empréstimo...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-x-circle me-2"></i>Cancelar
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmarDevolucao"
            :disabled="!localEmprestimo"
          >
            <i class="bi bi-check-circle me-2"></i>Confirmar Devolução
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-height-300 {
  max-height: 300px;
  object-fit: cover;
}

.text-truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
