<template>
  <div class="card border-0 p-0" style="width: 12rem">
    <div
      class="w-50 p-1 position-absolute text-white text-center"
      :class="book.status ? 'bg-success' : 'bg-danger'"
    >
      {{ book.status ? "Disponível" : "Indisponível" }}
    </div>
    <div class="p-3">
      <img
        :src="book.imagem ? book.imagem : '/assets/book3.png'"
        style="max-height: 200px; width: 100%; background-size: cover"
        alt="..."
      />
      <div class="mt-2">
        <h5 class="card-title">{{ book.titulo }}</h5>
        <p class="text-secondary mb-1">Autor: {{ book.autor }}</p>
      </div>
      <div class="d-flex justify-content-between mt-2">
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
}

.card:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  transform: scale(1.05);
}
</style>
