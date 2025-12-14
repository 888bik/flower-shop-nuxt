<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-bold mb-6">{{ title }}</h2>

    <div class="mb-4 mt-6 text-sm">
      <span>共 {{ totalCount }} 件商品</span>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
    >
      <ProductCard
        v-for="p in productListData"
        :key="p.id"
        :product="p"
        @add="onAdd"
        @quick="onQuick"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProductItem } from "~/types/api/good";
import ProductCard from "./ProductCard.vue";
import { useCartStore } from "#imports";
interface IProps {
  productListData: ProductItem[];
  title?: string;
  totalCount?: number;
}

const cartStore = useCartStore();

const {
  productListData,
  title = "热销推荐",
  totalCount = 0,
} = defineProps<IProps>();

async function onAdd(p: ProductItem) {
  console.log("Add to cart", p);
  await cartStore.addCart(p.id, 1);
  //重新获取购物车列表
  cartStore.fetchCart();
  $toast.success("添加购物车成功");
}

function onQuick(p: any) {
  console.log("Quick view", p);
  // 打开模态
}
</script>
