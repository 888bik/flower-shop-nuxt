<template>
  <div class="content">
    <cubic-bezier ref="myCubic"> 测试 </cubic-bezier>
    <button class="btn" @click="getData">开始</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const myCubic = ref<any>();
const params = {
  point: { x1: 250, y1: 50, x2: 100, y2: 400 },
  time: 0.5,
  xcubic: "linear",
  ycubic: "cubic-bezier(0.49, -0.29, 0.75, 0.41)",
};

const getData = () => {
  myCubic.value.start(params.point, params.time, params.xcubic, params.ycubic);
};
</script>
