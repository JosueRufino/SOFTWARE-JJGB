<template>
  <div class="container-fluid p-4">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">Lista de Funcionários</h1>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Criado em</th>
                    <th>Última Atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(funcionario, i) in funcionarios"
                    :key="funcionario.id"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>{{ funcionario.nome }}</td>
                    <td>{{ funcionario.email }}</td>
                    <td>{{ formatDate(funcionario.createdAt) }}</td>
                    <td>{{ formatDate(funcionario.updatedAt) }}</td>
                    <td>
                      <div class="btn-group" role="group">
                        <button
                          class="btn btn-sm btn-primary me-2"
                          @click="editFuncionario(funcionario)"
                        >
                          Editar
                        </button>
                        <button
                          class="btn btn-sm btn-danger"
                          @click="deleteFuncionario(funcionario.id)"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Empty state -->
              <div
                v-if="funcionarios.length === 0"
                class="alert alert-info text-center"
              >
                Nenhum funcionário cadastrado
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Employee Button -->
        <div class="text-center mt-3">
          <button
            class="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#addFuncionarioModal"
          >
            Adicionar Novo Funcionário
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Adding a New Employee -->
    <div
      class="modal fade"
      id="addFuncionarioModal"
      tabindex="-1"
      aria-labelledby="addFuncionarioModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addFuncionarioModalLabel">
              Adicionar Novo Funcionário
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addFuncionario">
              <div class="mb-3">
                <label for="nome" class="form-label">Nome</label>
                <input
                  v-model="newFuncionario.nome"
                  type="text"
                  class="form-control"
                  id="nome"
                  placeholder="Nome do Funcionário"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  v-model="newFuncionario.email"
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Email do Funcionário"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success w-100">
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFuncionariosStore } from "@/store/funcionary/index"; // Corrigido o caminho para a store

// Pinia store
const funcionarioStore = useFuncionariosStore();

const funcionarios = computed(() => funcionarioStore.funcionarios);

// Dados do novo funcionário
const newFuncionario = ref({
  nome: "",
  email: "",
});

// Utility function to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Função para adicionar um novo funcionário
const addFuncionario = async () => {
  try {
    await funcionarioStore.cadastrarFuncionario({
      nome: newFuncionario.value.nome,
      email: newFuncionario.value.email,
    });

    // Limpa o formulário
    newFuncionario.value = { nome: "", email: "" };

    // Fecha o modal
    const modal = document.getElementById("addFuncionarioModal");
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();
  } catch (error) {
    console.error("Erro ao adicionar funcionário:", error);
  }
};

// Função para editar um funcionário (ainda não implementada)
const editFuncionario = (funcionario) => {
  console.log("Editing", funcionario);
};

// Função para excluir um funcionário
const deleteFuncionario = async (id) => {
  try {
    // Excluir localmente
    funcionarioStore.funcionarios = funcionarioStore.funcionarios.filter(
      (f) => f.id !== id
    );

    // Excluir na API
    const response = await fetch(`http://localhost:3001/funcionarios/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir funcionário");
    }

    // Exibir sucesso ao excluir
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Funcionário excluído com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Ocorreu um erro ao tentar excluir o funcionário.",
    });
  }
};

// Carregar funcionários ao montar a página
onMounted(async () => {
  try {
    await funcionarioStore.obterFuncionarios(); // Chama a função para carregar os funcionários
  } catch (error) {
    console.error("Erro ao carregar funcionários:", error);
  }
});

definePageMeta({
  layout: "funcionario",
});
</script>
