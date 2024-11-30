<template>
  <div class="p-3" v-if="book">
    <NuxtLink
      to="/funcionario/livros"
      style="text-decoration: none; color: black"
    >
      <div class="d-flex align-items-center">
        <i class="bi bi-arrow-left-circle fs-2 me-2"></i>
        Voltar
      </div>
    </NuxtLink>
    <div
      class="card livro-card border-0 p-3 d-flex flex-row gap-3 align-items-start"
    >
      <!-- Imagem do livro -->
      <div class="livro-image-container">
        <img :src="book.imagem" alt="Capa do livro" class="livro-image" />
      </div>

      <!-- Informações do livro -->
      <div class="livro-info flex-grow-1">
        <div class="d-flex">
          <h5 class="fw-bold fs-3 me-3">{{ book.titulo }}</h5>
          <button
            class="btn"
            :class="
              book.quantidade_disponivel > 0 && book.status
                ? 'btn-success'
                : 'btn-danger'
            "
          >
            {{
              book.quantidade_disponivel > 0 && book.status
                ? "Disponível"
                : "Indisponível"
            }}
          </button>
        </div>
        <p class="text-muted mb-0">{{ book.description }}</p>
        <p class="mb-0"><strong>Autor:</strong> {{ book.autor }}</p>
        <p class="mb-0"><strong>ISBN:</strong> {{ book.isbn }}</p>
        <p class="mb-0">
          <strong>Ano de publicação:</strong> {{ book.ano_publicacao }}
        </p>
        <p class="mb-0">
          <strong>Quantidade total:</strong> {{ book.quantidade_total }}
        </p>
        <p class="mb-0">
          <strong>Quantidade total:</strong> {{ book.quantidade_disponivel }}
        </p>
        <p class="mb-0"><strong>Subcategoria:</strong> {{ subcategory }}</p>
      </div>
    </div>
    <div class="card p-2 mt-2 border-0">
      <p class="fw-bold">Descrição</p>
      {{ book.descricao }}
    </div>
    <div class="card mt-2 border-0 p-2 mb-4">
      <div>
        <!-- Navegação das tabs -->
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#tab1"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Estudantes em espera
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#tab2"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Emprestado em
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#tab3"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Histórico de emprestimos
            </button>
          </li>
        </ul>

        <!-- Conteúdo dos paineis -->
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="tab1"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <h5>Estudantes em espera</h5>
            <div class="mt-2">
              <table
                class="table table-striped text-center table-hover"
                v-if="studantesFilaEspera.length"
              >
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Estudante</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Número de estudante</th>
                    <th scope="col">Email</th>
                    <th scope="col">Data</th>
                    <th scope="col">Notificado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(f, i) in studantesFilaEspera" :key="i">
                    <th scope="row">{{ i + 1 }}</th>
                    <td>
                      <img
                        :src="f.estudante.imagem"
                        style="max-height: 40px; border-radius: 50%"
                      />
                    </td>
                    <td>{{ f.estudante.nome }}</td>
                    <td>{{ f.estudante.matricula }}</td>
                    <td>{{ f.estudante.email }}</td>
                    <td>{{ formatDateTime(f.estudante.createdAt) }}</td>
                    <td>
                      <div
                        class="text-center text-white p-1"
                        :class="f.notificado ? 'bg-success' : 'bg-danger'"
                        style="border-radius: 20px; font-size: 0.8rem"
                      >
                        {{ f.notificado ? "Notificado" : "Não notificado" }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else>
                <p class="text-center mt-4 text-secondary">
                  Dados não encontrados
                </p>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="tab2"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <h5>Emprestado em</h5>
            <table class="table table-striped text-center text-center">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Estudante</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Número</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Data de emprestimo</th>
                  <th scope="col">Data de devolucao</th>
                  <th scope="col">Data devolvida</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(e, i) in EmprestimosComEstudantes" :key="i">
                  <th scope="row">{{ i + 1 }}</th>
                  <td>
                    <img
                      :src="e.estudante.imagem"
                      style="max-height: 40px; border-radius: 50%"
                    />
                  </td>
                  <td>{{ e.estudante.nome }}</td>
                  <td>{{ e.estudante.matricula }}</td>
                  <td>{{ e.estudante.email }}</td>
                  <td>
                    <div
                      class="bg-warning text-white p-1"
                      style="border-radius: 20px; font-size: 0.8rem"
                    >
                      Em andamento
                    </div>
                  </td>
                  <td>{{ formatDateTime(e.data_emprestimo) }}</td>
                  <td>{{ formatDateTime(e.data_devolucao) }}</td>
                  <td class="text-secondary">Sem data</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="tab-pane fade"
            id="tab3"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <h5>Histórico</h5>
            <table class="table table-striped text-center text-center">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Estudante</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Número</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Data de emprestimo</th>
                  <th scope="col">Data de devolucao</th>
                  <th scope="col">Data devolvida</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(e, i) in EmprestimosComEstudantes2" :key="i">
                  <th scope="row">{{ i + 1 }}</th>
                  <td>
                    <img
                      :src="e.estudante.imagem"
                      style="max-height: 40px; border-radius: 50%"
                    />
                  </td>
                  <td>{{ e.estudante.nome }}</td>
                  <td>{{ e.estudante.matricula }}</td>
                  <td>{{ e.estudante.email }}</td>
                  <td class="text-white">
                    <div
                    class="
                    p-2"
                      :class="
                        getDevolucaoStatus(e.data_devolucao, e.data_devolvida)
                          .classe
                      "
                      style="border-radius: 20px; font-size: 0.8rem"
                    >
                      {{
                        getDevolucaoStatus(e.data_devolucao, e.data_devolvida)
                          .texto
                      }}
                    </div>
                  </td>
                  <td>{{ formatDateTime(e.data_emprestimo) }}</td>
                  <td>{{ formatDateTime(e.data_devolucao) }}</td>
                  <td :class="!e.data_devolvida ? 'text-secondary' : ''">
                    {{ formatDateTime(e.data_devolvida) || "Sem data" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script setup>
import { useBookStore } from "@/store/books/index";
import { useSubcategoryStore } from "@/store/subcategory/index";
import { useFilaEsperaStore } from "@/store/filaEspera/index";
import { useEmprestimosStore } from "@/store/emprestimo/index";

const useBook = useBookStore();
const useSubcategory = useSubcategoryStore();
const useFilaEspera = useFilaEsperaStore();
const useEmprestimos = useEmprestimosStore();
const route = useRoute();

// Função para formatar a data
const formatDateTime = (dateString) => {
  const date = new Date(dateString);

  // Extrair partes da data
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês ajustado (0-11)
  const year = date.getFullYear();

  // Extrair partes do horário
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Função para verificar se foi devolvido no prazo
function foiDevolvidoATempo(dataPrevista, dataDevolvida) {
  const dataPrevistaObj = new Date(dataPrevista);
  const dataDevolvidaObj = new Date(dataDevolvida);

  // Verificar validade das datas
  if (isNaN(dataPrevistaObj.getTime()) || isNaN(dataDevolvidaObj.getTime())) {
    return false; // Retorna false se alguma data for inválida
  }

  // Retorna true se devolvido no prazo
  return dataDevolvidaObj <= dataPrevistaObj;
}

const getDevolucaoStatus = (dataPrevista, dataDevolvida) => {
  const noPrazo = foiDevolvidoATempo(dataPrevista, dataDevolvida);
  return {
    texto: noPrazo ? "Devolvido a tempo" : "Atrasado",
    classe: noPrazo ? "bg-success" : "bg-danger",
  };
};

const book = computed(() => useBook.getBookId);
const subcategory = computed(() => useSubcategory?.subcategory?.nome);
const studantesFilaEspera = computed(() => useFilaEspera.filaAtual);
const EmprestimosComEstudantes = computed(
  () => useEmprestimos.emprestimosComEstudantes
);
const EmprestimosComEstudantes2 = computed(() => useEmprestimos.emprestimos2);
onMounted(async () => {
  await useBook.fetchBookById(route.params.id);
  await useSubcategory.fetchSubcategoryId(book.value.subcategoria_id);
  await useFilaEspera.fetchFilaPorLivro(route.params.id);
  await useEmprestimos.fetchEmprestimosPorLivro(route.params.id);
  await useEmprestimos.fetchEmprestimosPorLivroOthers(route.params.id);
});

definePageMeta({
  layout: "funcionario",
});
</script>

<style scoped>
.livro-card {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.livro-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.livro-image-container {
  width: 120px;
  height: 180px;
  overflow: hidden;
  flex-shrink: 0;
}

.livro-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.livro-info {
  flex: 1;
  color: #333;
}

.btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}
</style>
