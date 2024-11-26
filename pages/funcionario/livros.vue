<template>
  <div class="row gx-3 vh-100 w-100">
    <LivrosModalCategory :categorys="categorys" />
    <LivrosModalSubcategory />
    <div class="col-3">
      <div class="p-1">
        <LivrosFilter :categorys="categorys" />
      </div>
    </div>
    <div class="col">
      <div class="card border-0 mb-2" style="height: 50px">
        <div
          class="d-flex justify-content-between align-items-center h-100 px-2"
        >
          <div>
            <button type="button" class="btn btn-primary">
              <i class="bi bi-plus-circle"></i> Novo livro
            </button>
            <button
              type="button"
              class="btn btn-primary ms-2"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop1"
            >
              <i class="bi bi-bookmark-check-fill"></i> Categorias
            </button>
            <button
              type="button"
              class="btn btn-primary ms-2"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop2"
            >
              <i class="bi bi-tags-fill"></i> Subcategorias
            </button>
          </div>
          <div>
            <input
              type="email"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="Pesquise um livro"
            />
          </div>
        </div>
      </div>
      <div class="row w-100 gx-5 justify-content-start">
        <div
          v-if="books.length"
          class="col-3 mb-3"
          v-for="(book, i) in books"
          :key="i"
        >
          <div><LivrosCard :book="book" /></div>
        </div>
        <div v-else class="col-12 text-center">Nenhum livro encontrado</div>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <Pagination />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCategoryStore } from "@/store/category/index";
import { useSubcategoryStore } from "@/store/subcategory/index";
import { useBookStore } from "@/store/books/index";

const useBook = useBookStore();
const useCategory = useCategoryStore();
const useSubcategory = useSubcategoryStore();

const route = useRoute();
const searchTerm = ref("");

const books = computed(() => useBook.getAllBooks);
const categorys = computed(() => useCategory.categories);
const subcategorys = computed(() => useSubcategory.subcategories);

// Função para busca de livros
const searchBooks = () => {
  useBook.filterBooks({
    author: searchTerm.value,
  });
};

const query = computed(() => route.query);
// Função para aplicar os filtros
const applyQueryFilters = () => {
  if (query.value.status) {
    console.log("statis", query.value.status);
    useBook.filterByStatus(query.value.status);
  } else if (query.value.author) {
    useBook.filterByAuthor(query.value.author);
    console.log("autor", query.value.author);
  } else if (query.value.subcategory) {
    console.log("sub", query.value.subcategory);
    useBook.filterBySubcategory(query.value.subcategory);
  } else {
    useBook.fetchBooks();
  }
};

// Carrega as categorias e livros na inicialização
onMounted(async () => {
  await Promise.all([
    useBook.fetchBooks(),
    useCategory.fetchCategories(),
    useSubcategory.fetchSubcategoriesAndCategories(),
  ]);

  applyQueryFilters();
});

// Observa mudanças nos parâmetros da query
watch(
  () => route.query,
  () => {
    console.log("mudou");
    applyQueryFilters();
  }
);

definePageMeta({
  layout: "funcionario",
});
</script>
