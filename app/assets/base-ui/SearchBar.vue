<template>
  <div class="InputContainer">
    <input
      placeholder="搜索鲜花 / 花盒 / 礼品..."
      v-model="innerValue"
      id="input"
      class="input"
      name="text"
      type="text"
      @keyup.enter="onSearch"
      @click:append-inner="onSearch"
      @click:clear="onClear"
    >
    </input>
  <v-icon class="icon" icon="mdi-magnify" @click="onSearch"></v-icon>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, toRefs } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "search"]);

const { modelValue } = toRefs(props);
const innerValue = ref(modelValue.value);

watch(modelValue, (v) => (innerValue.value = v));
watch(innerValue, (v) => emit("update:modelValue", v));

function onSearch() {
  const kw = (innerValue.value || "").trim();
  emit("search", kw);
}

function onClear() {
  innerValue.value = "";
  emit("search", "");
}
</script>

<style scoped>
.InputContainer {
  width: 250px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(
    to bottom,
    rgb(227, 213, 255),
    rgb(255, 231, 231)
  );
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
}

.input {
  width: 240px;
  height: 40px;
  border: none;
  outline: none;
  caret-color: rgb(255, 81, 0);
  background-color: rgb(255, 255, 255);
  border-radius: 30px;
  padding-left: 15px;
  padding-right: 40px;
  letter-spacing: 0.8px;
  color: rgb(19, 19, 19);
  font-size: 13.4px;
}

.icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  background-color: rgb(229, 214, 254); /* 圆形背景色 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* 图标颜色 */
  cursor: pointer;
  font-size: 20px;
}
</style>
