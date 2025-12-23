<template>
  <nav class="nav-site theme-pink">
    <div class="flex flex-1 items-center ml-4">
      <LogoIcon />

      <div class="ml-2">
        <div class="text-lg font-semibold text-gold">花间雅苑</div>
        <div class="text-xs -mt-0.5">Luxury Flowers & Gifts</div>
      </div>

      <NuxtLink to="/" class="ml-5"> 首页 </NuxtLink>
    </div>

    <!-- 搜索框 -->
    <div class="flex items-center">
      <SearchBar v-model="keyword" @search="onSearch" />
    </div>

    <div class="flex flex-1 items-center justify-end mr-4">
      <div class="flex items-center px-4">
        <template v-if="!userStore.userInfo">
          <NuxtLink to="/login" class="mr-3">登录</NuxtLink>
          <NuxtLink to="/login" class="mr-3">注册</NuxtLink>
        </template>
        <div v-if="userStore.userInfo"></div>
        <NuxtLink to="/cart" class="mr-3">
          <span ref="cartIconRef" class="cart-fly-target">
            <v-badge
              location="top right"
              color="primary"
              :content="cartStore.totalCount"
              :offset-x="-5"
            >
              <v-icon icon="mdi-cart"></v-icon>
            </v-badge>
          </span>
        </NuxtLink>
      </div>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text" class="p-0">
            <v-avatar size="36">
              <img :src="avatarSrc" alt="用户头像" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="bg-surface px-3">
          <v-list-item to="/profile">
            <v-icon start>mdi-account</v-icon>
            个人中心
          </v-list-item>

          <v-list-item to="/coupon">
            <v-icon start>mdi-ticket-percent</v-icon>
            领券中心
          </v-list-item>

          <v-list-item to="/about">
            <v-icon start>mdi-information</v-icon>
            关于我们
          </v-list-item>

          <v-list-item to="/">
            <v-icon start>mdi-headset</v-icon>
            客服
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineOptions({
  ssr: false,
});
import SearchBar from "~/assets/base-ui/SearchBar.vue";
import LogoIcon from "~/assets/svg/IconLogo.vue";

const cartStore = useCartStore();
const userStore = useUserStore();

const cartIconRef = ref<HTMLElement | null>(null);
const uiStore = useUiStore();

const keyword = ref("");
const router = useRouter();

const mounted = ref(false);

const onSearch = (kw: string) => {
  const k = (kw || "").trim();
  if (!k) return;
  router.push({ path: "/search", query: { keyword: k } });
};

onMounted(() => {
  mounted.value = true;
  uiStore.cartIconEl = cartIconRef.value;
});

const avatarSrc = computed(() => {
  if (!mounted.value) {
    return "/default-avatar.svg";
  }
  return userStore.userInfo?.user?.avatar || "/default-avatar.svg";
});
</script>

<style>
/* nav */
.nav-site {
  @apply h-20 flex bg-[#ffffff] shadow-soft-lg  sticky top-0 z-50 
  border-b-borderColor text-text backdrop-blur-md;
}
.nav-size .nav-link {
  color: var(--c-text);
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
}
.nav-size .nav-link:hover {
  color: #fff;
  background: linear-gradient(
    90deg,
    var(--c-primary),
    color-mix(in srgb, var(--c-primary) 65%, #fff 35%)
  );
}
</style>
