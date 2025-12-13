<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <button @click="counter.increment()">+1</button>
  </div>
</template>

<script setup lang="ts">
const counter = useCounterStore();
</script>

<style scoped></style>
