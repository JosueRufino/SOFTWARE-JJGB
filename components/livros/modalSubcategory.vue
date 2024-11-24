<template>
  <div
    class="modal fade"
    id="staticBackdrop2"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content" style="height: 80vh; overflow: hidden">
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
          <!-- Container com as sessões e transições -->
          <div class="sections-container" :class="sectionClass">
            <!-- Sessão de Edição (Esquerda) -->
            <div class="section">
              <div class="form-content p-3">
                <h4 class="mb-3">Editar Subcategoria</h4>
                <form @submit.prevent="updateSubcategory">
                  <div class="mb-3">
                    <label for="editSubcategoryName" class="form-label"
                      >Nome da Subcategoria</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="editSubcategoryName"
                      v-model="editingSubcategory.name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="editCategorySelect" class="form-label"
                      >Categoria</label
                    >
                    <select
                      class="form-select"
                      id="editCategorySelect"
                      v-model="editingSubcategory.categoryId"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
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

            <!-- Sessão de Listagem (Meio) -->
            <div class="section">
              <div class="list-content p-3">
                <ul class="list-group">
                  <li
                    v-for="subcategory in subcategoriesWithCategories"
                    :key="subcategory.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span class="d-block">{{ subcategory.name }}</span>
                      <small class="text-muted"
                        >Categoria: {{ subcategory.categoryName }}</small
                      >
                    </div>
                    <div>
                      <button
                        class="btn btn-warning btn-sm me-2"
                        @click="editSubcategory(subcategory)"
                      >
                        Editar
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteSubcategory(subcategory.id)"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                </ul>
                <div class="text-end mt-3">
                  <button class="btn btn-primary" @click="goToCreate()">
                    Nova Subcategoria
                  </button>
                </div>
              </div>
            </div>

            <!-- Sessão de Cadastro (Direita) -->
            <div class="section">
              <div class="form-content p-3">
                <h4 class="mb-3">Nova Subcategoria</h4>
                <form @submit.prevent="saveNewSubcategory">
                  <div class="mb-3">
                    <label for="subcategoryName" class="form-label"
                      >Nome da Subcategoria</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="subcategoryName"
                      v-model="newSubcategory.name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="categorySelect" class="form-label"
                      >Categoria</label
                    >
                    <select
                      class="form-select"
                      id="categorySelect"
                      v-model="newSubcategory.categoryId"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Estado
const currentSection = ref("list");
const categories = ref([
  { id: 1, name: "Categoria 1" },
  { id: 2, name: "Categoria 2" },
  { id: 3, name: "Categoria 3" },
]);
const subcategories = ref([
  { id: 1, name: "Subcategoria 1", categoryId: 1 },
  { id: 2, name: "Subcategoria 2", categoryId: 1 },
  { id: 3, name: "Subcategoria 3", categoryId: 2 },
]);

const newSubcategory = ref({
  name: "",
  categoryId: "",
});

const editingSubcategory = ref({
  id: null,
  name: "",
  categoryId: null,
});

// Computed Properties
const currentTitle = computed(() => {
  switch (currentSection.value) {
    case "create":
      return "Nova Subcategoria";
    case "edit":
      return "Editar Subcategoria";
    default:
      return "Subcategorias";
  }
});

const sectionClass = computed(() => {
  switch (currentSection.value) {
    case "create":
      return "show-create";
    case "edit":
      return "show-edit";
    default:
      return "show-list";
  }
});

const subcategoriesWithCategories = computed(() => {
  return subcategories.value.map((sub) => ({
    ...sub,
    categoryName:
      categories.value.find((cat) => cat.id === sub.categoryId)?.name ||
      "Categoria não encontrada",
  }));
});

// Métodos
const goToList = () => {
  currentSection.value = "list";
};

const goToCreate = () => {
  newSubcategory.value = {
    name: "",
    categoryId: "",
  };
  currentSection.value = "create";
};

const editSubcategory = (subcategory) => {
  editingSubcategory.value = { ...subcategory };
  currentSection.value = "edit";
};

const saveNewSubcategory = () => {
  const newId = Math.max(0, ...subcategories.value.map((s) => s.id)) + 1;
  subcategories.value.push({
    id: newId,
    name: newSubcategory.value.name,
    categoryId: newSubcategory.value.categoryId,
  });
  goToList();
};

const updateSubcategory = () => {
  const index = subcategories.value.findIndex(
    (s) => s.id === editingSubcategory.value.id
  );
  if (index !== -1) {
    subcategories.value[index] = { ...editingSubcategory.value };
  }
  goToList();
};

const deleteSubcategory = (id) => {
  if (confirm("Tem certeza que deseja excluir esta subcategoria?")) {
    const index = subcategories.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      subcategories.value.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.sections-container {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.section {
  width: 33.33%;
  flex-shrink: 0;
}

.show-list {
  transform: translateX(-33.33%);
}

.show-create {
  transform: translateX(-66.66%);
}

.show-edit {
  transform: translateX(0);
}

.list-content,
.form-content {
  height: 100%;
  overflow-y: auto;
}

* {
  transition: all 0.3s ease;
}
</style>
