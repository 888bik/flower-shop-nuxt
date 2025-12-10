<template>
  <div class="bg-white rounded-xl p-4 shadow-sm">
    <h4 class="font-semibold text-gray-700 mb-3">分类</h4>
    <ul class="space-y-2">
      <li v-for="c in categories" :key="c.id">
        <button
          @click="$emit('select', c.id)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg transition',
            selected === c.id
              ? 'bg-green-50 text-green-700'
              : 'hover:bg-gray-50',
          ]"
        >
          {{ c.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  selected: { type: [Number, String], default: null },
});
</script>
