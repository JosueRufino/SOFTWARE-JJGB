<template>
  <div class="sidebar">
    <div
      class="d-flex justify-content-center align-items-center p-2"
      style="border-bottom: 1px solid lightgray"
    >
      <img src="/assets/logo.png" alt="" style="max-height: 100px" />
      <h5 style="color: #2596be" class="fw-bold">BIBLIOTECA JJGB</h5>
    </div>
    <div class="sidebar-header">
      <div class="sidebar-profile">
        <img
          src="/assets/user.png"
          alt="Satoru Gojou"
          class="sidebar-profile-image"
        />
        <h3 class="sidebar-profile-name mb-0">{{ user?.nome }}</h3>
        <p class="sidebar-profile-role mb-0">Administrador</p>
      </div>
    </div>
    <div class="sidebar-menu">
      <ul class="sidebar-nav">
        <NuxtLink
          v-for="(link, i) in links"
          :key="i"
          :to="link.path"
          style="text-decoration: none"
        >
          <li
            class="sidebar-nav-item"
            :class="route.path === link.path ? 'active' : 'sidebar-nav-item'"
          >
            <a href="#" class="sidebar-nav-link">
              <i :class="link.icon"></i>
              <span>{{ link.name }}</span>
            </a>
          </li>
        </NuxtLink>
      </ul>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
const user = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  user.value = storedUser ? JSON.parse(storedUser) : null;
});
const links = [
  {
    name: "Dashboard",
    icon: "bi bi-grid",
    path: "/funcionario",
  },
  {
    name: "Livros",
    icon: "bi bi-book",
    path: "/funcionario/livros",
  },
  {
    name: "Estudantes",
    icon: "bi bi-people",
    path: "/funcionario/estudante",
  },
  {
    name: "Funcionários",
    icon: "bi bi-person-circle",
    path: "/funcionario/funcionarios",
  },
  {
    name: "Emprestimos/Lista de espera",
    icon: "bi bi-list-columns-reverse",
    path: "/funcionario/emprestimo_ListaDeEspera",
  },
  {
    name: "Notificações",
    icon: "bi bi-bell",
    path: "/funcionario/notificacoes",
  },
];
</script>
<style lang="scss" scoped>
.sidebar {
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-profile-name {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.sidebar-profile-role {
  font-size: 0.9rem;
  color: #6c757d;
}

.sidebar-menu {
  flex-grow: 1;
  overflow-y: auto;
}

.sidebar-nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav-item {
  border-bottom: 1px solid #e9ecef;
}

.sidebar-nav-item:hover {
  background-color: lightgray;
  transition: color 0.3s ease;
}

.active {
  background-color: #2596be;
  .sidebar-nav-link {
    color: white;
  }
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: #343a40;
  text-decoration: none;
}

.sidebar-nav-link i {
  margin-right: 0.75rem;
}
</style>
