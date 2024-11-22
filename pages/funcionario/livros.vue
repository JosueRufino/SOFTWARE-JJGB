<template>
  <div class="row gx-3 vh-100 w-100">
    <div class="col-3">
      <div class="p-1"><LivrosFilter /></div>
    </div>
    <div class="col">
      <div class="row w-100  gx-5  justify-content-start">
        <div class="card">
            nav
        </div>
        <div class="col-3" v-for="i in 6" :key="i">
            <div class="p-1">   <LivrosCard /></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "funcionario",
});
</script>
