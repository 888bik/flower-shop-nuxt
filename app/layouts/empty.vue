<template>
  <div class="empty-layout">
    <!-- 中间内容占位 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.empty-layout {
  min-height: 100vh;
  background: #cbc0d3;
}
</style>
