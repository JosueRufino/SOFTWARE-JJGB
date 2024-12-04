<template>
  <div class="row">
    <!-- Card do Estudante -->
    <div class="col-3">
      <StudantsCardId :studant="studant" />
    </div>

    <!-- Parte de Dados -->
    <div class="col-9">
      <!-- Navs com Tabs (Bootstrap) -->
      <ul class="nav nav-tabs" id="studentTab" role="tablist">
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
            Informações
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
            Histórico
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
            Documentos
          </a>
        </li>
      </ul>

      <!-- Conteúdo das Tabs -->
      <div class="tab-content mt-2" id="studentTabContent">
        <!-- Painel de Informações -->
        <div
          class="tab-pane fade show active"
          id="info"
          role="tabpanel"
          aria-labelledby="info-tab"
        >
          <h6>Informações Pessoais</h6>
          <p>Nome: {{ studant?.nome }}</p>
          <p>Matricula: {{ studant?.matricula }}</p>
          <p>Email: {{ studant?.email }}</p>
        </div>

        <!-- Painel de Histórico -->
        <div
          class="tab-pane fade"
          id="historico"
          role="tabpanel"
          aria-labelledby="historico-tab"
        >
          <h6>Histórico Acadêmico</h6>
          <p>Histórico de notas, cursos, etc.</p>
        </div>

        <!-- Painel de Documentos -->
        <div
          class="tab-pane fade"
          id="documentos"
          role="tabpanel"
          aria-labelledby="documentos-tab"
        >
          <h6>Documentos</h6>
          <p>Lista de documentos.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStudentStore } from "../../../store/studantes/index";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

// Usando o store para buscar dados do estudante
const useStudant = useStudentStore();
const route = useRoute();

// Computed para obter os dados do estudante
const studant = computed(() => useStudant.getStudentById);

// Carregar os dados do estudante ao montar o componente
onMounted(async () => {
  await useStudant.fetchStudentById(route.params.id);
});

// Definindo as configurações da página
definePageMeta({
  layout: "funcionario",
});
</script>

<style scoped>
/* Estilo das abas usando Bootstrap */
.nav-tabs .nav-link {
  font-size: 1rem;
}

.tab-content {
  padding: 20px;
}

.tab-pane h6 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}
</style>
