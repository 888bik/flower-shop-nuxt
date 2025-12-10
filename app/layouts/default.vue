<template>
  <div>
    <Header />
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from "~/components/AppFooter.vue";
import Header from "~/components/AppHeader.vue";
</script>

<style scoped></style>
