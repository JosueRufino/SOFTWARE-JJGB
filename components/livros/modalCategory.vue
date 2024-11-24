<template>
  <div
    class="modal fade"
    id="staticBackdrop1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content" style="height: 85vh; overflow: hidden">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            {{ currentTitle }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-0">
          <!-- Tabs Navigation -->
          <ul class="nav nav-tabs" id="categoryTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: currentSection === 'list' }"
                type="button"
                role="tab"
                aria-selected="currentSection === 'list'"
                disabled
              >
                Listagem
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: currentSection === 'create' }"
                type="button"
                role="tab"
                aria-selected="currentSection === 'create'"
                disabled
              >
                Nova Categoria
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: currentSection === 'edit' }"
                type="button"
                role="tab"
                aria-selected="currentSection === 'edit'"
                disabled
              >
                Editar Categoria
              </button>
            </li>
          </ul>

          <!-- Tabs Content -->
          <div
            class="tab-content"
            id="categoryTabsContent"
            style="height: 70vh; overflow-y: auto"
          >
            <!-- Sessão de Listagem -->
            <div
              class="tab-pane fade"
              :class="{
                show: currentSection === 'list',
                active: currentSection === 'list',
              }"
              id="list-section"
              role="tabpanel"
            >
              <div class="p-2">
                <div class="row">
                  <div class="col-9">
                    <input
                      class="form-control"
                      placeholder="Pesquise uma categoria"
                      v-model="searchTerm"
                    />
                  </div>
                  <div class="col-3">
                    <button class="btn btn-primary" @click="goToCreate">
                      <i class="bi bi-plus-circle"></i>
                      Criar categoria
                    </button>
                  </div>
                </div>
                <div class="list-content p-3" style="height: 60vh">
                  <table class="table table-hover table-striped text-center">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(category, index) in filteredCategories"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ category.nome }}</td>
                        <td>{{ formatDateTime(category.createdAt) }}</td>
                        <td>
                          <button
                            class="btn btn-warning btn-sm me-2"
                            data-bs-target="#edit-tab"
                            @click="editCategory(category)"
                          >
                            Editar
                          </button>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="deleteCategory(category.id)"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Sessão de Cadastro -->
            <div
              class="tab-pane fade"
              :class="{
                show: currentSection === 'create',
                active: currentSection === 'create',
              }"
              id="create-section"
              role="tabpanel"
            >
              <div class="p-3">
                <h4 class="mb-3">Nova Categoria</h4>
                <form @submit.prevent="saveNewCategory">
                  <div class="mb-3">
                    <label for="categoryName" class="form-label"
                      >Nome da Categoria</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="categoryName"
                      v-model="newCategory"
                      required
                    />
                  </div>
                  <div class="text-end">
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      @click="goToList"
                    >
                      Voltar
                    </button>
                    <button type="submit" class="btn btn-success">
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Sessão de Edição -->
            <div
              class="tab-pane fade"
              :class="{
                show: currentSection === 'edit',
                active: currentSection === 'edit',
              }"
              id="edit-section"
              role="tabpanel"
            >
              <div class="p-3">
                <h4 class="mb-3">Editar Categoria</h4>
                <form @submit.prevent="updateCategory">
                  <div class="mb-3">
                    <label for="editCategoryName" class="form-label"
                      >Nome da Categoria</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="editCategoryName"
                      v-model="editingCategory.nome"
                      required
                    />
                  </div>
                  <div class="text-end">
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      @click="goToList"
                    >
                      Voltar
                    </button>
                    <button type="submit" class="btn btn-success">
                      Atualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "@/store/category/index";
import Swal from "sweetalert2";

const useCategory = useCategoryStore();

onMounted(async () => {
  await useCategory.fetchCategories();
});

const categories = computed(() => useCategory.categories);

const currentSection = ref("list");
const newCategory = ref("");
const editingCategory = ref({});
const searchTerm = ref("");

const currentTitle = computed(() => {
  switch (currentSection.value) {
    case "create":
      return "Nova Categoria";
    case "edit":
      return "Editar Categoria";
    default:
      return "Categorias";
  }
});

const filteredCategories = computed(() => {
  if (!searchTerm.value) {
    return categories.value || [];
  }
  const term = searchTerm.value.toLowerCase();
  return (categories.value || []).filter((category) => {
    return (
      category &&
      typeof category.nome === "string" &&
      category.nome.toLowerCase().includes(term)
    );
  });
});

const goToList = () => {
  currentSection.value = "list";
};

const goToCreate = () => {
  newCategory.value = "";
  currentSection.value = "create";
};

const editCategory = (category) => {
  editingCategory.value = { ...category };
  currentSection.value = "edit";
};

const saveNewCategory = async () => {
  const createdAt = new Date().toISOString().replace("T", " ").split(".")[0];
  const response = await useCategory.addCategory(newCategory.value, createdAt);

  if (response.success) {
    Swal.fire({
      title: "Sucesso!",
      text: "Categoria adicionada com sucesso!",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    goToList();
  } else {
    Swal.fire({
      title: "Erro!",
      text: "Não foi possível adicionar a categoria.",
      icon: "error",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

const updateCategory = () => {
  // Chama a função do Pinia para atualizar a categoria
  useCategory.updateCategory(editingCategory.value);
  goToList(); // Após a atualização, vai para a lista
};

const deleteCategory = async (categoryId) => {
  useCategory.deleteCategory(categoryId)
};

const selectCategory = (category) => {
  useCategory.selectCategory(category);
};

const formatDateTime = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "";

  const formattedDate = parsedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = parsedDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};
</script>

<style scoped>
.sections-container {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
  overflow-y: hidden;
}

.section {
  width: 33.33%;
  flex-shrink: 0;
}

/* Classes para controlar a posição do slider */
.show-list {
  transform: translateX(0);
}

.show-create {
  transform: translateX(-33.33%);
}

.show-edit {
  transform: translateX(-66.66%);
}

.list-content,
.form-content {
  height: 100%;
  overflow-y: auto;
}

* {
  transition: all 0.3s ease;
}

.nav-link.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
