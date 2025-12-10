<template>
  <div></div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp();

try {
  const res = await $api.goods.getInfo(1);
  console.log(res);
} catch (err) {
  console.error(err);
}
</script>

<style scoped></style>
