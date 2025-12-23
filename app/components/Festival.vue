<template>
  <div class="border-green-500 rounded-lg overflow-hidden w-full">
    <!-- 上方 Banner -->
    <div class="w-full h-1/2">
      <img
        src="https://img02.hua.com/uploadpic/banner/25_xmas_fu_banner_pc.png"
        alt="Banner"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 下方卡片区域 -->
    <div
      class="w-full h-1/2 p-4 grid grid-cols-4 gap-4"
      style="background-color: #339f8a"
    >
      <ProductCardV4
        v-for="(item, index) in products"
        :key="index"
        :title="item.title"
        :image="item.image"
        :price="item.price"
        :unit="item.unit"
        badge="NEW"
        @click="handleClick(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCardV4 from "./ProductCard-v4.vue";

const router = useRouter();

const products = [
  {
    id: 224,
    title: "繁花似锦",
    price: 329.0,
    unit: "件",
    image:
      "  https://s-take-out-gdjt-aaa-1326300379.cos.ap-guangzhou.myqcloud.com/1765691782804_edbf0dd60b0d4211b88fdf8d3d89f889_8010103.jpg",
  },
  {
    id: 221,
    title: "馨情无限",
    price: 188.0,
    unit: "件",
    image:
      "https://s-take-out-gdjt-aaa-1326300379.cos.ap-guangzhou.myqcloud.com/1765522692949_9ae8cded8e5e4c27b7e1363e47c2f8cc_201704251739035644.jpg",
  },
  {
    id: 211,
    title: "时光美好",
    price: 211.0,
    unit: "件",
    image:
      "https://s-take-out-gdjt-aaa-1326300379.cos.ap-guangzhou.myqcloud.com/1765457052567_8385f2974e8e444382cae21cf5f9dd1b_9012567.jpg",
  },
  {
    id: 207,
    title: "绽放未来",
    price: 233.0,
    unit: "件",
    image:
      " https://s-take-out-gdjt-aaa-1326300379.cos.ap-guangzhou.myqcloud.com/1765456127664_7f41e059521c417e86b38643c864cf89_9012521.jpg",
  },
];

const handleClick = (id: number) => {
  router.push(`/detail/${id}`);
};
</script>
