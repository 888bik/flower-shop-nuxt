<template>
  <nav class="nav-site theme-pink">
    <!-- left -->
    <div class="left flex flex-1 items-center ml-4">
      <LogoIcon />

      <div class="ml-2">
        <div class="text-lg font-semibold text-gold">花间雅苑</div>
        <div class="text-xs -mt-0.5">Luxury Flowers & Gifts</div>
      </div>

      <NuxtLink to="/" class="btn ml-3">首页</NuxtLink>
    </div>

    <!-- center -->
    <div class="center flex items-center">
      <input
        type="search-bar"
        placeholder="搜索鲜花 / 花盒 / 礼品..."
        class="search-input"
      />
    </div>

    <!-- right -->
    <div class="right flex flex-1 items-center justify-end mr-4">
      <div class="flex items-center px-4">
        <NuxtLink to="/login" class="btn">登录</NuxtLink>
        <NuxtLink to="/login" class="btn">注册</NuxtLink>
        <NuxtLink to="/cart" class="btn">
          <v-badge
            location="top right"
            color="primary"
            :content="cartStore.totalCount"
            :offset-x="-5"
          >
            <v-icon icon="mdi-cart"></v-icon>
          </v-badge>
        </NuxtLink>
      </div>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar size="36" class="bg-primary text-white">
              {{ 111 }}
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="bg-surface px-3">
          <v-list-item to="/profile">
            <v-icon start>mdi-account</v-icon>个人中心
          </v-list-item>

          <v-list-item to="/coupon" class="hover:text-gold">
            <v-icon start>mdi-cart </v-icon>领卷中心
          </v-list-item>

          <v-list-item to="/about" class="hover:text-gold">
            <v-icon start> mdi-information </v-icon>关于我们
          </v-list-item>

          <v-list-item to="/" class="hover:text-gold">
            <v-icon start> mdi-headset</v-icon>客服
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </nav>
</template>

<script setup lang="ts">
import LogoIcon from "~/assets/svg/LogoIcon.vue";
import SearchIcon from "~/assets/svg/SearchIcon.vue";
const cartStore = useCartStore();
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
/* search */
.search-box {
  @apply flex items-center justify-between;
}

.search-input {
  @apply w-72 h-12 pl-10 pr-4  text-[#2222] bg-onSurface border font-semibold
  focus:outline-none transition border-solid rounded-3xl;
}

.search-input:focus {
  @apply border-gold shadow-soft-lg;
}

.search-icon {
  @apply absolute left-3;
}

/* profile */
.profile {
  @apply relative flex items-center justify-center
  ml-4 w-[78px] h-[42px]
  rounded-full cursor-pointer
  bg-[#b78f1a] hover:bg-[#a47a12]
  transition-colors shadow-md;
}

.btn {
  @apply px-3 hover:text-gold;
}
</style>
