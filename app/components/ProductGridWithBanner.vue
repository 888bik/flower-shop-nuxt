<template>
  <div class="product-showcase">
    <div class="showcase-header">
      <h2 class="title">{{ title }}</h2>
      <v-btn
        class="load-more-btn"
        @click="
          $router.push({
            path: '/category',
            query: {
              cid: categoryId,
              name: title,
            },
          })
        "
        >更多{{ title }}</v-btn
      >
    </div>

    <div class="product-grid">
      <div
        v-for="product in products.slice(0, 8)"
        :key="product.id"
        class="product-card-wrapper"
      >
        <ProductCardV1
          :title="product.title"
          :image="product.cover"
          :price="product.minPrice"
          :old-price="product.minOprice"
          :rating="product.rating"
          :sold="product.saleCount"
          :banners="product.banners"
          @add="$emit('add', product)"
          @click-card="$emit('clickCard', product)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCardV1 from "~/components/ProductCard-v1.vue";
import type { GoodsSimple } from "~/types/api/home";

interface Props {
  categoryId: number;
  title: string;
  products: GoodsSimple[];
}
interface IEmits {
  (e: "add", product: GoodsSimple): void;
  (e: "clickCard", product: GoodsSimple): void;
}
const props = defineProps<Props>();
const emit = defineEmits<IEmits>();
</script>

<style scoped>
.product-showcase {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.showcase-header .title {
  font-size: 20px;
  font-weight: 700;
}
.load-more-btn {
  padding: 6px 12px;
  background: #ff6fa3;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.load-more-btn:hover {
  background: #ff82b0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 一行 4 个 */
  grid-auto-rows: auto; /* 高度自适应内容 */
  gap: 16px;
}

.product-card-wrapper {
  width: 100%;
}
</style>
