<template>
  <div class="p-1">
    <div
      class="card d-flex justify-content-center align-items-end p-1 border-0 mb-2"
      style="height: 50px"
    >
      <input
        style="width: 200px"
        type="text"
        class="form-control"
        placeholder="Filtrar por mátricula"
      />
    </div>
    <div class="row w-100">
      <div class="col-3" v-for="(studant, i) in studants" :key="i">
        <div class="p-3"><StudantsCard :studant="studant" /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "funcionario",
});
import { useStudentStore } from "@/store/studantes/index";

const useStudants = useStudentStore();

const studants = computed(() => useStudants.getAllStudents);

onMounted(async () => {
  await useStudants.fetchStudents();
});
</script>
