<template>
  <div class="card border-0 p-2" style="width: 15rem">
    <div style="border-bottom: 1px solid lightgray">
      <h4>Filtragem</h4>
    </div>

    <!-- Botão de Resetar Filtros -->
    <button class="btn btn-outline-danger w-100 mt-2" @click="resetFilters" v-if="isReset">
      Resetar Filtros
    </button>

    <!-- Filtro por Autor -->
    <div class="mt-3" style="border-bottom: 1px solid lightgray">
      <p class="mb-0 text-secondary">Filtrar por autor</p>
      <select
        class="form-select form-select-md mb-3"
        aria-label="Large select example"
        v-model="author"
      >
        <option value="">Selecione</option>
        <option :value="author" v-for="(author, i) in authores" :key="i">
          {{ author }}
        </option>
      </select>
    </div>

    <!-- Filtro por Estado -->
    <div class="mt-3" style="border-bottom: 1px solid lightgray">
      <p class="mb-0 text-secondary">Filtrar por estado</p>
      <select
        class="form-select form-select-md mb-3"
        aria-label="Large select example"
        v-model="status"
      >
        <option value="">Selecione</option>
        <option value="true">Disponível</option>
        <option value="false">Indisponível</option>
      </select>
    </div>

    <!-- Filtro por Categoria e Subcategoria -->
    <div class="mt-3">
      <p class="mb-0 text-secondary">Filtrar por categorias</p>
      <select
        class="form-select form-select-md mb-3"
        aria-label="Large select example"
        v-model="idCategory"
      >
        <option value="">Selecione</option>
        <option :value="cat.id" v-for="(cat, i) in categorys" :key="i">
          {{ cat.nome }}
        </option>
      </select>
    </div>

    <!-- Lista de Subcategorias -->
    <div>
      <div v-if="subcategorys.length && idCategory">
        <ul class="list-unstyled">
          <li
            v-for="(subcat, index) in subcategorys"
            :key="index"
            class="subcategory-item"
            :class="{ active: subcat.id === idSub }"
            @click="handleSubcategoryClick(subcat.id)"
          >
            {{ subcat.nome }}
          </li>
        </ul>
      </div>
      <div v-else-if="!idCategory">
        <p class="text-secondary text-center">Selecione uma categoria</p>
      </div>
      <div v-else>
        <p class="text-secondary text-center">Sem subcategorias</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSubcategoryStore } from "@/store/subcategory/index";
import { useBookStore } from "@/store/books/index";
import { useRouter, useRoute } from "vue-router";

const props = defineProps(["categorys"]);

const router = useRouter();
const route = useRoute();

// Variáveis reativas para filtros
const idCategory = ref(""); // Categoria selecionada
const idSub = ref(""); // Subcategoria clicada
const author = ref(""); // Autor selecionado
const status = ref(""); // Estado selecionado

const useSubcategory = useSubcategoryStore();
const useBook = useBookStore();

const subcategorys = computed(() => useSubcategory.subcategoriesByCategories);
const authores = computed(() => useBook.getAuthors);

// Verifica se há filtros aplicados na URL
const query = computed(() => route.query);
const isReset = computed(() => {
  // Verifica se existe algum dos parâmetros de filtro na query
  return !!query.value.status || !!query.value.author || !!query.value.subcategory;
});

onMounted(async () => {
  await useSubcategory.fetchSubcategoriesAndCategories();
  await useBook.fetchBooks();
});

// Atualizar URL ao selecionar um autor
watch(author, (newAuthor) => {
  if (newAuthor) {
    resetFiltersExcept("author");
    router.push({ query: { author: newAuthor } });
  }
});

// Atualizar URL ao selecionar um estado
watch(status, (newStatus) => {
  if (newStatus) {
    resetFiltersExcept("status");
    router.push({ query: { status: newStatus } });
  }
});

// Atualizar subcategorias ao selecionar uma categoria
watch(idCategory, async (newCategory) => {
  if (newCategory) {
    await useSubcategory.getSubcategoriesByCategoryId(newCategory);
  } else {
    idSub.value = ""; // Limpar subcategoria se nenhuma categoria for selecionada
  }
});

// Atualizar URL ao clicar em uma subcategoria
const handleSubcategoryClick = (subcategoryId) => {
  idSub.value = subcategoryId;
  resetFiltersExcept("subcategory");
  router.push({ query: { subcategory: subcategoryId } });
};

// Função para resetar todos os filtros
const resetFilters = async () => {
  idCategory.value = "";
  idSub.value = "";
  author.value = "";
  status.value = "";
  router.push({ query: {} });
  await useBook.fetchBooks();
};

// Função para resetar todos os filtros, exceto o especificado
const resetFiltersExcept = (filter) => {
  if (filter !== "author") author.value = "";
  if (filter !== "status") status.value = "";
  if (filter !== "subcategory") idSub.value = "";
  if (filter !== "category") idCategory.value = "";
};
</script>

<style scoped>
.subcategory-item.active {
  background-color: #007bff; /* Fundo azul */
  color: white; /* Texto branco */
}

.subcategory-item {
  padding: 0.5rem;
  background-color: #f8f9fa; /* Fundo claro */
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.subcategory-item:hover {
  background-color: #0056b3; /* Azul mais escuro */
  color: white;
}
</style>
