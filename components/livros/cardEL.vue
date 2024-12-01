<template>
  <LivrosModalEmprestarLivro :book="book" />
  <LivrosModelAdicionarListaEspera />
  <div class="card border-0 p-0" style="width: 12rem">
    <div class="w-50 p-1 position-absolute text-white text-center" :class="book.status ? 'bg-success' : 'bg-danger'">
      {{ book.status ? "Disponível" : "Indisponível" }}
    </div>
    <div class="p-3">
      <img :src="book.imagem ? book.imagem : '/assets/book3.png'"
        style="max-height: 200px; width: 100%; background-size: cover" alt="..." />
      <div class="mt-2">
        <h5 class="card-title">{{ book.titulo }}</h5>
        <p class="text-secondary mb-1">Autor: {{ book.autor }}</p>
      </div>
      <div class="d-flex justify-content-between mt-2 w-100">
        <!-- Botão para abrir o modal e atualizar a rota -->
        <button
          v-if="book.status"
          type="button"
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#emprestimoModal"
          @click="addRouteParameter(book.id)"
        >
          Emprestar este livro
        </button>
        <!-- Botão para abrir o modal e atualizar a rota -->
        <button
          v-else
          type="button"
          class="btn btn-danger"
          data-bs-toggle="modal"
          data-bs-target="#listaEsperaModal"
          @click="addRouteParameter(book.id)"
        >
          Adicionar na fila de espera
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { useBookStore } from "@/store/books/index";
import { useRouter } from "vue-router"; // Importa o router

// Recebe as props do livro
const props = defineProps({
  book: Object,
});

// Instancia o Vue Router
const router = useRouter();

// Função para adicionar o ID do livro como parâmetro na URL
const addRouteParameter = (bookId) => {
  router.push({
    query: {
      ...router.currentRoute.value.query, // Preserva os outros parâmetros na rota
      livroId: bookId, // Adiciona ou atualiza o parâmetro livroId
    },
  });
};

const useBook = useBookStore();
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(1.05);
}
</style>
