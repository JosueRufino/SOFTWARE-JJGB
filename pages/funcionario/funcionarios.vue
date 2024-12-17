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
                  <tr v-for="funcionario in funcionarios" :key="funcionario.id">
                    <td>{{ funcionario.id }}</td>
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
                          @click="deleteFuncionario(funcionario)"
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
            @click="openAddFuncionarioModal"
          >
            Adicionar Novo Funcionário
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data (replace with actual data source)
const funcionarios = ref([
  {
    id: "1",
    nome: "Maria Santos",
    email: "maria.santos@exemplo.com",
    senha: "senha123",
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-10T12:00:00Z"
  }
])

// Utility function to format dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Placeholder functions for actions
const editFuncionario = (funcionario) => {
  // Implement edit functionality
  console.log('Editing', funcionario)
}

const deleteFuncionario = (funcionario) => {
  // Implement delete functionality
  console.log('Deleting', funcionario)
}

const openAddFuncionarioModal = () => {
  // Implement add new employee functionality
  console.log('Opening add employee modal')
}

definePageMeta({
  layout: "funcionario",
})
</script>