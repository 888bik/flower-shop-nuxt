<template>
  <LoadingWords
    :words="['苹果', '香蕉', '橘子', '西瓜']"
    label="加载中"
    :highlightColor="'#ff6fa3'"
    :duration="5"
  />
</template>

<script setup>
import LoadingWords from "~/assets/base-ui/LoadingWords.vue";
</script>
