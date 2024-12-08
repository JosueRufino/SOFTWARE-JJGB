<template>
  <div class="p-1">
    <!-- Filtro de Estudantes e Botão lado a lado -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <!-- Input de pesquisa -->
      <div class="d-flex">
        <input
          style="width: 200px"
          type="text"
          class="form-control"
          placeholder="Filtrar por matrícula"
          v-model="searchQuery"
        />
      </div>

      <!-- Botão para abrir o modal -->
      <div class="ms-3">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalCadastroEstudante"
        >
          Cadastrar Estudante
        </button>
      </div>
    </div>

    <!-- Modal de Cadastro de Estudantes -->
    <div
      class="modal fade"
      id="modalCadastroEstudante"
      tabindex="-1"
      aria-labelledby="modalCadastroEstudanteLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCadastroEstudanteLabel">
              Cadastrar Estudante
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Formulário de cadastro -->
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="nome" class="form-label">Nome</label>
                <input
                  type="text"
                  class="form-control"
                  id="nome"
                  v-model="newStudant.nome"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="matricula" class="form-label">Matrícula</label>
                <input
                  type="text"
                  class="form-control"
                  id="matricula"
                  v-model="newStudant.matricula"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="newStudant.email"
                  required
                />
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Exibição de estudantes -->
    <div class="row w-100">
      <div class="col-3" v-for="(studant, i) in filteredStudants" :key="i">
        <div class="p-3"><StudantsCard :studant="studant" /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "funcionario",
});

import { useStudentStore } from "@/store/studantes/index";
import { ref, computed, onMounted } from "vue";

// Acesso ao store de estudantes
const useStudants = useStudentStore();

// Computed para pegar todos os estudantes
const studants = computed(() => useStudants.getAllStudents);

// Valor da pesquisa
const searchQuery = ref("");

// Computed para filtrar os estudantes com base na matrícula
const filteredStudants = computed(() => {
  if (!searchQuery.value) return studants.value;
  return studants.value.filter((student) =>
    student.matricula.includes(searchQuery.value)
  );
});

// Objeto para armazenar os dados do novo estudante
const newStudant = ref({
  nome: "",
  matricula: "",
  email: "",
  livros: 0, // Definido como 0
  data_penalidade: null, // Definido como null
  penality: false, // Definido como false
  createdAt: new Date().toISOString(), // A data de criação será a data atual
  updatedAt: new Date().toISOString(), // A data de atualização será a data atual
});

onMounted(async () => {
  await useStudants.fetchStudents();
});

// Função para cadastrar um novo estudante
const handleSubmit = async () => {
  // Aqui você pode usar uma ação do Vuex ou diretamente uma API para cadastrar o estudante
  await useStudants.addStudent(newStudant.value);

  // Limpar o formulário após o envio
  newStudant.value = {
    nome: "",
    matricula: "",
    email: "",
    livros: 0,
    data_penalidade: null,
    penality: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Fechar o modal
  const modal = new bootstrap.Modal(
    document.getElementById("modalCadastroEstudante")
  );
  modal.hide();
};
</script>
