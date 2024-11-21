<template>
  <div class="containe">
    <div class="content-img">
      <div class="overlay"></div>
      <div class="content d-flex justify-content-center">
        <div class="me-4">
          <h1>BIBLIOTECA JJGB</h1>
          <p>Bem-vindo ao sistema</p>
        </div>
        <div class="card p-3" style="width: 400px; height: 70vh">
          <div class="d-flex justify-content-between">
            <div>
              <h3>Login</h3>
              <p>Identifique-se para prosseguir</p>
            </div>
            <div>
              <img src="../public/assets/image2.png" alt="" />
            </div>
          </div>
          <form @submit.prevent="handleLogin">
            <div>
              <span>Insira o seu email</span>
              <input
                v-model="email"
                type="email"
                class="form-control"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <span>Insira a sua senha</span>
              <input
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Senha"
                required
              />
            </div>
            <div>
              <span>Esqueceu a sua senha?</span>
            </div>
            <div v-if="errorMessage" class="text-danger">
              <span>{{ errorMessage }}</span>
            </div>
            <div>
              <button type="submit" class="btn btn-primary w-100">
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/store/auth/auth"; // Importa a store de autenticação
import { useRouter } from "vue-router"; // Para navegação

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    // Tenta realizar o login com o email e senha
    await authStore.login(email.value, password.value);
    router.push("/funcionario"); // Redireciona para a página principal
  } catch (error) {
    errorMessage.value = "Credenciais inválidas. Tente novamente."; // Exibe erro
  }
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.container {
  width: 100%;
  min-height: 100vh;
}

.content-img {
  height: 300px;
  width: 100%;
  position: relative;
  background-image: url("../assets/image.jpeg");
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(37, 150, 190, 0.6);
}

.content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.1rem;
}
</style>
