<template>
  <div
    class="modal fade"
    id="staticBackdrop2"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel2"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content" style="height: 85vh; overflow: hidden">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel2">
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
          <ul class="nav nav-tabs" id="subcategoryTabs" role="tablist">
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
                Nova Subcategoria
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
                Editar Subcategoria
              </button>
            </li>
          </ul>

          <!-- Tabs Content -->
          <div
            class="tab-content"
            id="subcategoryTabsContent"
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
                      placeholder="Pesquise uma subcategoria"
                      v-model="searchTerm"
                    />
                  </div>
                  <div class="col-3">
                    <button class="btn btn-primary" @click="goToCreate">
                      <i class="bi bi-plus-circle"></i>
                      Criar subcategoria
                    </button>
                  </div>
                </div>
                <div class="list-content p-3" style="height: 60vh">
                  <table class="table table-hover table-striped text-center">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Categoria Pai</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(subcategory, index) in filteredSubcategories"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ subcategory?.nome }}</td>
                        <td>{{ subcategory?.categoria?.nome }}</td>
                        <td>{{ formatDateTime(subcategory.createdAt) }}</td>
                        <td>
                          <button
                            class="btn btn-warning btn-sm me-2"
                            data-bs-target="#edit-tab"
                            @click="editSubcategory(subcategory)"
                          >
                            Editar
                          </button>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="deleteSubcategory(subcategory?.id)"
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
                      v-model="newSubcategory"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="parentCategory" class="form-label"
                      >Categoria</label
                    >
                    <select
                      id="parentCategory"
                      class="form-control"
                      v-model="selectedCategory"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.nome }}
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
                      v-model="editingSubcategory.nome"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="editParentCategory" class="form-label"
                      >Categoria</label
                    >
                    <select
                      id="editParentCategory"
                      class="form-control"
                      v-model="editingSubcategory.categoria_id"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.nome }}
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "@/store/category/index";
import { useSubcategoryStore } from "@/store/subcategory/index";
import Swal from "sweetalert2";
const useSubcategory = useSubcategoryStore();
const useCategory = useCategoryStore();

onMounted(async () => {
  await useCategory.fetchCategories();
  await useSubcategory.fetchSubcategoriesAndCategories();
});

const categories = computed(() => useCategory.categories);
const subcategories = computed(() => useSubcategory.subcategories);

const currentSection = ref("list");
const newSubcategory = ref("");
const selectedCategory = ref(null);
const editingSubcategory = ref({});
const searchTerm = ref("");

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

const filteredSubcategories = computed(() => {
  if (!searchTerm.value) {
    return subcategories.value || [];
  }
  const term = searchTerm.value.toLowerCase();
  return (subcategories.value || []).filter((subcategory) => {
    return (
      subcategory &&
      typeof subcategory.nome === "string" &&
      subcategory.nome.toLowerCase().includes(term)
    );
  });
});

const goToList = () => {
  currentSection.value = "list";
};

const goToCreate = () => {
  newSubcategory.value = "";
  selectedCategory.value = null;
  currentSection.value = "create";
};

const editSubcategory = (subcategory) => {
  editingSubcategory.value = {
    id: subcategory.id,
    nome: subcategory.nome,
    categoria_id: subcategory.categoria_id,
    categoria: subcategory.categoria,
  };
  currentSection.value = "edit";
};

const saveNewSubcategory = async () => {
  if (!selectedCategory.value || !newSubcategory.value.trim()) {
    Swal.fire("Erro!", "Por favor, preencha todos os campos.", "error");
    return;
  }

  try {
    const result = await useSubcategory.addSubcategory(
      newSubcategory.value, // nome da subcategoria
      selectedCategory.value // id da categoria selecionada
    );

    if (result.success) {
      // Atualiza a lista de subcategorias
      await useSubcategory.fetchSubcategoriesAndCategories();
      goToList();

      // Limpa os campos
      newSubcategory.value = "";
      selectedCategory.value = null;
    }
  } catch (error) {
    Swal.fire("Erro!", "Falha ao criar a subcategoria.", "error");
  }
};
const updateSubcategory = async () => {
  if (!editingSubcategory.value.nome?.trim()) {
    Swal.fire("Erro!", "Nome da subcategoria é obrigatório.", "error");
    return;
  }

  try {
    const updateData = {
      nome: editingSubcategory.value.nome,
      categoria_id:
        editingSubcategory.value.categoria_id ||
        editingSubcategory.value.categoria?.id,
    };

    const result = await useSubcategory.updateSubcategory(
      editingSubcategory.value.id,
      updateData
    );

    if (result.success) {
      await useSubcategory.fetchSubcategoriesAndCategories();
      goToList();
    }
  } catch (error) {
    Swal.fire("Erro!", "Falha ao atualizar a subcategoria.", "error");
  }
};

const deleteSubcategory = async (id) => {
  if (!id) {
    Swal.fire("Erro!", "ID da subcategoria não fornecido.", "error");
    return;
  }

  try {
    const result = await useSubcategory.deleteSubcategory(id);
    
    // Se a deleção foi bem-sucedida, atualiza a lista
    if (result?.success) {
      await useSubcategory.fetchSubcategoriesAndCategories();
    }
  } catch (error) {
    console.error("Erro ao deletar subcategoria:", error);
    // O erro já será tratado no Pinia
  }
};

const formatDateTime = (dateTime) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(dateTime).toLocaleString(undefined, options);
};
</script>

<style scoped>
/* Estilos adicionais, caso necessário */
</style>
