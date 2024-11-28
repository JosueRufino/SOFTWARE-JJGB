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

      <!-- Botão de disponibilidade -->
    </div>
    <div class="card mt-2 border-0 p-2">
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
            <h3>Estudantes em espera</h3>
            <p>Conteúdo relacionado à aba Home.</p>
          </div>
          <div
            class="tab-pane fade"
            id="tab2"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <h3>Emprestado em</h3>
            <p>Conteúdo relacionado à aba Profile.</p>
          </div>
          <div
            class="tab-pane fade"
            id="tab3"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <h3>tabs</h3>
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

const useBook = useBookStore();
const useSubcategory = useSubcategoryStore();
const route = useRoute();

const book = computed(() => useBook.getBookId);
const subcategory = computed(() => useSubcategory.subcategory.nome);
onMounted(async () => {
  await useBook.fetchBookById(route.params.id);
  await useSubcategory.fetchSubcategoryId(book.value.subcategoria_id);
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
