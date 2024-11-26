<template>
  <nav aria-label="Paginação" v-if="totalPages > 1">
    <ul class="pagination">
      <!-- Botão Anterior -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a 
          class="page-link" 
          href="#" 
          @click.prevent="changePage(currentPage - 1)"
        >
          Anterior
        </a>
      </li>

      <!-- Primeira página -->
      <li 
        class="page-item" 
        :class="{ active: currentPage === 1 }"
        v-if="currentPage > 2"
      >
        <a 
          class="page-link" 
          href="#" 
          @click.prevent="changePage(1)"
        >
          1
        </a>
      </li>

      <!-- Páginas anteriores com reticências -->
      <li class="page-item" v-if="currentPage > 3">
        <span class="page-link">...</span>
      </li>

      <!-- Páginas adjacentes -->
      <li 
        class="page-item" 
        v-for="page in visiblePages" 
        :key="page"
        :class="{ active: currentPage === page }"
      >
        <a 
          class="page-link" 
          href="#" 
          @click.prevent="changePage(page)"
        >
          {{ page }}
        </a>
      </li>

      <!-- Páginas posteriores com reticências -->
      <li class="page-item" v-if="currentPage < totalPages - 2">
        <span class="page-link">...</span>
      </li>

      <!-- Última página -->
      <li 
        class="page-item" 
        :class="{ active: currentPage === totalPages }"
        v-if="currentPage < totalPages - 1"
      >
        <a 
          class="page-link" 
          href="#" 
          @click.prevent="changePage(totalPages)"
        >
          {{ totalPages }}
        </a>
      </li>

      <!-- Botão Próximo -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a 
          class="page-link" 
          href="#" 
          @click.prevent="changePage(currentPage + 1)"
        >
          Próximo
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

// Definição das props para tornar o componente genérico
const props = defineProps({
  // Total de itens
  totalItems: {
    type: Number,
    required: true
  },
  // Itens por página
  itemsPerPage: {
    type: Number,
    default: 10
  },
  // Página atual
  modelValue: {
    type: Number,
    default: 1
  }
})

// Emite eventos para comunicação com o componente pai
const emit = defineEmits(['update:modelValue'])

// Calcula o total de páginas
const totalPages = computed(() => 
  Math.ceil(props.totalItems / props.itemsPerPage)
)

// Página atual
const currentPage = computed(() => props.modelValue)

// Páginas visíveis
const visiblePages = computed(() => {
  const range = []
  const start = Math.max(1, currentPage.value - 1)
  const end = Math.min(totalPages.value, currentPage.value + 1)
  
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  
  return range
})

// Função para mudar de página
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:modelValue', page)
  }
}
</script>

<style scoped>
.pagination .page-item.active .page-link {
  background-color: #007bff;
  color: white;
}
</style>