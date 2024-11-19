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
          <form>
            <div>
              <span>Insira o seu email</span>
              <input type="text" aria-label="First name" class="form-control" />
            </div>
            <div>
              <span>Insira a sua senha</span>
              <input
                type="password"
                aria-label="First name"
                class="form-control"
              />
            </div>
            <div>
              <span>Esqueceu a sua senha?</span>
            </div>
            <div>
              <button class="btn btn-primary w-100">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
