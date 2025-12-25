<template>
  <div class="min-h-screen bg-page mx-auto px-10 py-8">
    <!-- 搜索结果信息（放在顶部） -->
    <div
      v-if="products.length > 0"
      class="mb-6 text-center text-gray-600 text-lg flex items-start"
    >
      “<span class="font-semibold text-primary">{{ keyword }}</span
      >” 的搜索结果， 共找到
      <span class="font-semibold text-primary">{{ total }}</span> 件商品
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <ThreeBodyLoader />
    </div>

    <div v-else>
      <div v-if="products.length === 0" class="text-center py-10 text-muted">
        没有找到 “{{ keyword }}” 的搜索结果
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
            <ProductCardV2
              :title="p.title"
              badge="HOT"
              :desc="p.description"
              :image="p.cover"
              :price="p.minPrice"
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
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import ProductCardV2 from "~/components/ProductCard-v2.vue";
import type { searchItem } from "~/types/api/goods";

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const cartStore = useCartStore();

const keyword = ref((route.query.keyword as string) ?? "");
const products = ref<searchItem[]>([]);
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

async function search() {
  const kw = (keyword.value || "").trim();
  if (!kw) {
    products.value = [];
    total.value = 0;
    return;
  }
  loading.value = true;
  try {
    const res = await $api.goods.search(kw, page.value, limit.value);
    products.value = res.records;
    total.value = res?.total;
    // 更新 URL query 保持可分享
    router.replace({
      path: "/search",
      query: {
        keyword: kw,
        page: String(page.value),
        limit: String(limit.value),
      },
    });
  } catch (err) {
    console.error(err);
    $toast?.error?.("搜索失败，请重试");
  } finally {
    loading.value = false;
  }
}

const onAdd = async (id: number) => {
  await cartStore.addCart(id, 1);
};

// 当路由 query.keyword 改变，更新 keyword
watch(
  () => route.query.keyword,
  (v) => {
    keyword.value = (v as string) || "";
    page.value = Number(route.query.page ?? 1);
    search();
  }
);

// 当页码或排序改变，重新搜索
watch([page, sortBy], () => search());

onMounted(() => {
  search();
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
.text-muted {
  color: var(--c-muted);
}
</style>
