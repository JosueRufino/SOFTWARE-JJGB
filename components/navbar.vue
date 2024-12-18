<template>
  <div class="navbar w-100 p-1">
    <button type="button" class="btn btn-outline">
      <i class="bi bi-list fs-5 text-dark"></i>
    </button>
    <div class="d-flex me-4 mt-2">
      <button type="button" class="btn position-relative">
        <i class="bi bi-bell-fill fs-4"></i>
        <span
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          99+
        </span>
      </button>
      <button type="button" class="btn btn-outline me-1">
        <i class="bi bi-gear-fill fs-4"></i>
      </button>
      <div class="btn-group dropstart">
        <img
          src="/assets/user.png"
          alt="Satoru Gojou"
          style="max-height: 50px; border-radius: 50%"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        />

        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li @click="logout">
            <a class="dropdown-item" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  // Exemplo: Limpar dados de sessão ou token
  localStorage.removeItem("user"); // ou qualquer dado que seja usado para armazenar o estado de login

  // Redireciona o usuário para a página de login
  router.push("/");
};
</script>

<style scoped>
.navbar {
  background-color: white;
}
</style>
