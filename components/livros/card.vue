<template>
  <div class="card border-0 p-0 position-relative" style="width: 11rem">
    <div
      class="status-label w-50 p-1 position-absolute text-white text-center"
      :class="book.status ? 'bg-success' : 'bg-danger'"
      style="font-size: 0.8rem"
    >
      {{ book.status ? "Disponível" : "Indisponível" }}
    </div>
    <div class="p-3">
      <div class="button-group position-absolute">
        <NuxtLink :to="`/funcionario/livros/${book.id}`">
          <button class="btn btn-primary">
            <i class="bi bi-eye-fill"></i>
          </button>
        </NuxtLink>
        <button class="btn btn-secondary">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-danger" @click="handleDelete(book.id)">
          <i class="bi bi-trash-fill"></i>
        </button>
      </div>
      <div style="height: 30vh;">
        <img
          v-if="book.imagem"
          :src="book.imagem"
          style="background-size: cover; width: 100%;"
          alt="..."
        />
        <img
          v-else
          src="/assets/book.png"
          style="background-size: cover;  width: 100%;"
          alt="..."
        />
      </div>
      <div class="mt-2">
        <h5 class="card-title text-truncate">{{ book.titulo }}</h5>
        <p class="text-secondary mb-1 author-text" style="font-size: .8rem;">Autor: {{ book.autor }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import { useBookStore } from "@/store/books/index";

const props = defineProps({
  book: Object,
});

const useBook = useBookStore();

const handleDelete = async (bookId) => {
  const result = await Swal.fire({
    title: "Você tem certeza?",
    text: "Essa ação não pode ser desfeita!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await useBook.deleteBook(bookId); // Chama a ação para deletar o livro
      Swal.fire("Excluído!", "O livro foi excluído com sucesso.", "success");
      await useBook.fetchBooks();
    } catch (error) {
      Swal.fire("Erro!", "Erro ao excluir o livro: " + error.message, "error");
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.card:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(1.05);
}

.status-label {
  top: 10px;
  left: 10px;
}

.button-group {
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.button-group button {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
