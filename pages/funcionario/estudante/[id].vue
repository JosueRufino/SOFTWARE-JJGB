<template>
  <div class="container-fluid student-detail">
    <ModalValidarDevolucao :emprestimo="selectedEmprestimo" />
    <div class="row g-4">
      <!-- Card do Estudante -->
      <div class="col-lg-3 col-md-12">
        <StudantsCardId :studant="studant" class="mb-4" />
      </div>

      <!-- Parte de Dados -->
      <div class="col-lg-9 col-md-12">
        <!-- Navs com Tabs (Bootstrap) -->
        <ul
          class="nav nav-pills nav-fill border-bottom pb-2 mb-3"
          id="studentTab"
          role="tablist"
        >
          <li class="nav-item" role="presentation">
            <a
              class="nav-link active"
              id="info-tab"
              data-bs-toggle="tab"
              href="#info"
              role="tab"
              aria-controls="info"
              aria-selected="true"
            >
              <i class="bi bi-person-badge me-2"></i>Informações
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="historico-tab"
              data-bs-toggle="tab"
              href="#historico"
              role="tab"
              aria-controls="historico"
              aria-selected="false"
            >
              <i class="bi bi-book me-2"></i>Livros em Empréstimo
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="documentos-tab"
              data-bs-toggle="tab"
              href="#documentos"
              role="tab"
              aria-controls="documentos"
              aria-selected="false"
            >
              <i class="bi bi-file-earmark-text me-2"></i>Histórico
            </a>
          </li>
        </ul>

        <!-- Conteúdo das Tabs -->
        <div class="tab-content" id="studentTabContent">
          <!-- Painel de Informações -->
          <div
            class="tab-pane fade show active"
            id="info"
            role="tabpanel"
            aria-labelledby="info-tab"
          >
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Informações Pessoais</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <p class="mb-2">
                      <strong>Nome:</strong> {{ studant?.nome }}
                    </p>
                    <p class="mb-2">
                      <strong>Matricula:</strong> {{ studant?.matricula }}
                    </p>
                  </div>
                  <div class="col-md-6">
                    <p class="mb-2">
                      <strong>Email:</strong> {{ studant?.email }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Painel de Histórico de Empréstimos -->
          <div
            class="tab-pane fade"
            id="historico"
            role="tabpanel"
            aria-labelledby="historico-tab"
          >
            <div class="card">
              <div
                class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">Livros em Empréstimo</h5>
                <span class="badge bg-light text-primary">
                  {{ emprestimosPendentes?.length }} Livros
                </span>
              </div>

              <div v-if="emprestimosPendentes.length > 0" class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div
                    v-for="emprestimo in emprestimosPendentes"
                    :key="emprestimo.id"
                    class="list-group-item list-group-item-action p-3"
                  >
                    <div class="d-flex w-100 align-items-center">
                      <div class="book-image me-3">
                        <img
                          :src="emprestimo.livro?.imagem"
                          v-if="
                            emprestimo &&
                            emprestimo.livro &&
                            emprestimo.livro?.imagem
                          "
                          class="img-fluid rounded book-thumbnail"
                          :alt="emprestimo.livro.nome"
                          onerror="this.src='https://via.placeholder.com/150x225.png?text=Capa+do+Livro'"
                        />
                      </div>
                      <div class="flex-grow-1">
                        <div
                          class="d-flex justify-content-between align-items-center mb-2"
                        >
                          <h5 class="mb-0 text-truncate">
                            {{ emprestimo?.livro?.nome }}
                          </h5>
                          <small class="text-muted">
                            ISBN: {{ emprestimo.livro?.isbn }}</small
                          >
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <p class="mb-1">
                              <strong>Empréstimo:</strong>
                              {{ formatDate(emprestimo.data_emprestimo) }}
                            </p>
                            <p class="mb-1">
                              <strong>Devolução:</strong>
                              {{ formatDate(emprestimo.data_devolucao) }}
                            </p>
                          </div>
                          <div class="col-md-6 text-end">
                            <button
                              class="btn btn-outline-primary btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#validarDevolucao"
                              @click="selecionarEmprestimo(emprestimo)"
                            >
                              <i class="bi bi-arrow-return-left me-2"></i
                              >Devolver
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="card-body text-center">
                <p class="mb-0 text-muted">
                  <i class="bi bi-info-circle me-2"></i>Não há livros em
                  empréstimo no momento.
                </p>
              </div>
            </div>
          </div>

          <!-- Painel de Documentos -->
          <div
            class="tab-pane fade"
            id="documentos"
            role="tabpanel"
            aria-labelledby="documentos-tab"
          >
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Histórico</h5>
              </div>
              <div class="card-body">
                <div class="container mt-4">
                  <!-- Título da Seção -->
                  <h3 class="mb-3">Histórico de Empréstimos</h3>

                  <!-- Tabela com classes do Bootstrap -->
                  <table class="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Título</th>
                        <th scope="col">Autor</th>
                        <th scope="col">ISBN</th>
                        <th scope="col">Data de Empréstimo</th>
                        <th scope="col">Data de Devolução</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="emprestimo in emprest" :key="emprestimo.id">
                        <td scope="row">{{ emprestimo?.livro?.titulo }}</td>
                        <td>
                          {{ emprestimo?.livro?.autor || "Desconhecido" }}
                        </td>
                        <td>{{ emprestimo?.livro?.isbn || "N/A" }}</td>
                        <td>{{ formatDate(emprestimo?.data_emprestimo) }}</td>
                        <td>{{ formatDate(emprestimo?.data_devolucao) }}</td>
                        <td>
                          <span
                            class="badge"
                            :class="
                              emprestimo.status === 1
                                ? 'bg-success'
                                : 'bg-warning'
                            "
                          >
                            {{
                              emprestimo.status === 1 ? "Devolvido" : "Pendente"
                            }}
                          </span>
                        </td>
                        <td>
                          <button
                            v-if="emprestimo.status !== 1"
                            class="btn btn-outline-primary btn-sm"
                            @click="selecionarEmprestimo(emprestimo)"
                          >
                            <i class="bi bi-arrow-return-left me-2"></i>Devolver
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStudentStore } from "../../../store/studantes/index";
import { useEmprestimosStore } from "../../../store/emprestimo/index";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import ModalValidarDevolucao from "~/components/studants/modalValidarDevolucao.vue";

definePageMeta({
  layout: "funcionario",
});

// Usando os stores
const useStudant = useStudentStore();
const useEmprestimos = useEmprestimosStore();
const route = useRoute();
const router = useRouter();
// Variável para armazenar o empréstimo selecionado
// Declare a ref para o empréstimo selecionado
const selectedEmprestimo = ref(null);

// Método para selecionar o empréstimo
const selecionarEmprestimo = (emprestimo) => {
  selectedEmprestimo.value = emprestimo;
};
// Computed para obter os dados do estudante e empréstimos pendentes
const studant = computed(() => useStudant.getStudentById);
const emprestimosPendentes = computed(
  () => useEmprestimos.emprestimosDoEstudante
);
const emprest = computed(() => useEmprestimos.emprestimosDoEstudante);

// Carregar os dados do estudante e dos empréstimos ao montar o componente
onMounted(async () => {
  await useStudant.fetchStudentById(route.params.id);
  await useEmprestimos.fetchEmprestimosPendentesPorEstudante(route.params.id);
  await useEmprestimos.fetchEmprestimosPorEstudante(route.params.id);
});

// Método para formatar data
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Placeholder para devolução de livro
const devolverLivro = (emprestimoId) => {
  router.push(`/funcionario/estudante/v`);
  console.log(`Devolver livro com ID: ${emprestimoId}`);
};
</script>

<style scoped>
.student-detail {
  background-color: #f4f6f9;
  min-height: 100vh;
  padding: 20px 0;
}

.nav-pills .nav-link {
  color: #495057;
  transition: all 0.3s ease;
}

.nav-pills .nav-link.active {
  background-color: var(--primary);
  color: blue;
}

.book-thumbnail {
  max-width: 120px;
  max-height: 180px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.list-group-item {
  transition: background-color 0.3s ease;
}

.list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Responsividade */
@media (max-width: 768px) {
  .book-thumbnail {
    max-width: 80px;
    max-height: 120px;
  }
}
</style>
