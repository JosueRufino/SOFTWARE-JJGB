<template>
  <div class="contain">
    <!-- Tela principal -->
    <div class="content-img">
      <div class="overlay"></div>
      <div class="content d-flex justify-content-center align-items-center">
        <!-- Texto de boas-vindas -->
        <div class="welcome-text me-4">
          <h1>BIBLIOTECA JJGB</h1>
          <p>Bem-vindo ao sistema</p>
        </div>

        <!-- Card de login -->
        <div
          class="card p-3"
          style="width: 400px; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3>Login</h3>
              <p class="text-secondary mt-1" style="font-size: 1rem">
                Identifique-se para prosseguir
              </p>
            </div>
            <div>
              <img src="../public/assets/image2.png" alt="Login" />
            </div>
          </div>

          <!-- Formulário -->
          <form @submit.prevent="handleLogin">
            <!-- Campo de e-mail -->
            <div>
              <label for="email">Insira o seu e-mail</label>
              <input
                v-model="email"
                id="email"
                type="email"
                class="form-control"
                placeholder="Email"
                required
              />
            </div>

            <!-- Campo de senha -->
            <div class="mt-3">
              <label for="password">Insira a sua senha</label>
              <input
                v-model="password"
                id="password"
                type="password"
                class="form-control"
                placeholder="Senha"
                required
              />
            </div>

            <!-- Link de recuperação de senha -->
            <div class="mt-3 d-flex justify-content-end">
              <a href="#" class="forgot-password">Esqueceu a sua senha?</a>
            </div>

            <!-- Mensagem de erro -->
            <div v-if="errorMessage" class="text-danger mt-2">
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Botão de login -->
            <div class="mt-3">
              <button
                type="submit"
                class="btn btn-primary w-100"
                style="height: 50px"
                :disabled="loading"
              >
                <i
                  class="bi bi-box-arrow-in-right"
                  :class="{ 'spinner-border spinner-border-sm': loading }"
                ></i>
                {{ loading ? "Entrando..." : "Entrar" }}
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
import Swal from "sweetalert2"; // Importa SweetAlert2

// Variáveis reativas
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false); // Controle de estado de loading

// Store de autenticação e roteador
const authStore = useAuthStore();
const router = useRouter();

// Função de login
const handleLogin = async () => {
  errorMessage.value = ""; // Limpa a mensagem de erro
  loading.value = true; // Ativa o estado de loading

  try {
    // Mostra um alerta de carregamento
    Swal.fire({
      title: "Carregando...",
      text: "Por favor, aguarde",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    // Tenta realizar o login com o email e senha
    const result = await authStore.login(email.value, password.value);

    // Verifica o resultado do login
    if (result.success) {
      // Mensagem de sucesso com timer
      Swal.fire({
        icon: "success",
        title: "Login realizado!",
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redireciona para a página principal
      router.push("/funcionario");
    } else {
      // Mensagem de erro com SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Erro no login",
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    // Trata erros inesperados
    console.error("Erro inesperado ao fazer login:", error);
    Swal.fire({
      icon: "error",
      title: "Erro no servidor",
      text: "Erro ao conectar ao servidor. Tente novamente.",
      timer: 1500,
      showConfirmButton: false,
    });
  } finally {
    loading.value = false; // Desativa o estado de loading
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
  height: 400px;
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
  padding: 8rem;
  color: white;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.1rem;
}

input {
  height: 50px;
}

.spinner-border {
  margin-right: 8px;
  vertical-align: middle;
}
</style>
