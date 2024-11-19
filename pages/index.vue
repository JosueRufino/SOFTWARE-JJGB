<template>
  <div class="containe">
    <div class="content-img">
      <div class="overlay"></div>
      <div class="content d-flex justify-content-center">
        <div class="me-4">
          <h1>BIBLIOTECA JJGB</h1>
          <p>Bem-vindo ao sistema</p>
        </div>
        <div class="card mt" style="width: 400px; height: 70vh;">jjj</div>
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
