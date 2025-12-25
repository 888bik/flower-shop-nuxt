<template>
  <div class="min-h-screen bg-page mx-auto px-10 py-8">
    <!-- 搜索结果信息（放在顶部） -->
    <div
      v-if="products.length > 0"
      class="mb-6 text-center text-gray-600 text-lg flex items-start"
    >
      分类 “<span class="font-semibold text-primary">{{ categoryName }}</span
      >” 下共有
      <span class="font-semibold text-primary">{{ total }}</span> 件商品
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <ThreeBodyLoader />
    </div>

    <div v-else>
      <div v-if="products.length === 0" class="text-center py-10 text-muted">
        分类 “{{ categoryName }}” 下暂无商品
      </div>

      <div v-else>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          <div
            v-for="p in products"
            :key="p.id"
            class="cursor-pointer"
            @click="goProduct(p.id)"
          >
            <ProductCardV1
              :title="p.title"
              :image="p.cover"
              :price="p.minPrice"
              :old-price="p.minOprice"
              :rating="p.rating as number"
              :sold="p.saleCount"
              :banners="p.banners"
              @add="onAdd(p.id)"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-center items-center gap-4">
          <v-pagination v-model="page" :length="pageCount" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import ProductCardV1 from "~/components/ProductCard-v1.vue";
import type { ProductItem } from "~/types/api/goods";

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const cartStore = useCartStore();

const categoryId = computed(() => Number(route.query.cid) || null);
const categoryName = computed(() => String(route.query.name || "分类"));

const products = ref<ProductItem[]>([]);
const loading = ref(false);

const page = ref(Number(route.query.page ?? 1));
const limit = ref(Number(route.query.limit ?? 12));
const total = ref(0);

const pageCount = computed(() => Math.ceil(total.value / limit.value));

const sortBy = ref("relevance");
const sortOptions = [
  { text: "相关度", value: "relevance" },
  { text: "销量", value: "sale" },
  { text: "价格：低到高", value: "price_asc" },
  { text: "价格：高到低", value: "price_desc" },
];

async function getProductListByCid() {
  if (!categoryId.value) return;

  loading.value = true;
  try {
    const res = await $api.goods.getProductList(
      page.value,
      limit.value,
      categoryId.value
    );
    products.value = res.list;
    total.value = res?.totalCount;
  } catch (err) {
    $toast?.error?.("获取分类数据失败，请重试");
  } finally {
    loading.value = false;
  }
}

const onAdd = async (id: number) => {
  const success = await cartStore.addCart(id, 1);
  if (success) {
    await cartStore.fetchCart();
    $toast.success("加入购物车成功");
  }
};

watch([page, sortBy], () => getProductListByCid());

watch(
  () => route.query.cid,
  () => {
    page.value = Number(route.query.page ?? 1);
    limit.value = Number(route.query.limit ?? 12);
    getProductListByCid();
  },
  { immediate: true }
);

onMounted(() => {
  getProductListByCid();
});

function goProduct(id: number) {
  router.push(`/detail/${id}`);
}
</script>

<style scoped>
.card {
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 8px;
  border-radius: 8px;
  background: white;
}
</style>
