<template>
  <nav
    class="h-20 flex bg-brand shadow-soft-lg text-text-primary sticky top-0 z-50"
  >
    <!-- left -->
    <div class="left flex flex-1 items-center ml-4">
      <LogoIcon />

      <div class="ml-2">
        <div class="text-lg font-semibold text-gold">花间雅苑</div>
        <div class="text-xs -mt-0.5">Luxury Flowers & Gifts</div>
      </div>

      <div class="ml-6">
        <NuxtLink to="/" class="nav-item">首页</NuxtLink>
        <NuxtLink to="/category" class="nav-item">分类</NuxtLink>
        <NuxtLink to="/collections" class="nav-item">礼盒精选</NuxtLink>
        <NuxtLink to="/about" class="nav-item">关于我们</NuxtLink>
      </div>
    </div>

    <!-- center -->
    <div class="center flex items-center">
      <div class="search-box">
        <input
          type="text"
          placeholder="搜索鲜花 / 花盒 / 礼品..."
          class="search-input"
        />
        <span class="search-icon">
          <SearchIcon />
        </span>
      </div>
    </div>

    <!-- right -->
    <div class="right flex flex-1 items-center justify-end mr-4">
      <div class="btns flex items-center">
        <NuxtLink to="/login" class="btn">登录</NuxtLink>
        <NuxtLink to="/login" class="btn">注册</NuxtLink>
        <NuxtLink to="/cart" class="btn">购物车</NuxtLink>
      </div>

      <!-- profile -->
      <div class="profile" ref="profileRef" @click.stop="togglePanel">
        <MenuIcon class="mx-1 text-white hover:text-[#ffd700]" />
        <UserIcon class="mx-1 text-white hover:text-[#ffd700]" />

        <!-- panel -->
        <div v-if="showPanel" class="panel" @click.stop>
          <div class="panel-section">
            <NuxtLink to="/login" class="panel-item">登录</NuxtLink>
            <NuxtLink to="/login" class="panel-item">注册</NuxtLink>
          </div>

          <div class="panel-section border-t border-[#b78f1a]">
            <NuxtLink to="/order" class="panel-item">订单</NuxtLink>
            <NuxtLink to="/cart" class="panel-item">购物车</NuxtLink>
            <NuxtLink to="/service" class="panel-item">客服</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import LogoIcon from "~/assets/svg/LogoIcon.vue";
import MenuIcon from "~/assets/svg/MenuIcon.vue";
import SearchIcon from "~/assets/svg/SearchIcon.vue";
import UserIcon from "~/assets/svg/UserIcon.vue";

const showPanel = ref(false);
const profileRef = ref<HTMLElement | null>(null);

function togglePanel() {
  showPanel.value = !showPanel.value;
}

function handleClickOutside(e: MouseEvent) {
  if (profileRef.value && !profileRef.value.contains(e.target as Node)) {
    showPanel.value = false;
  }
}

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* nav */
.btn {
  @apply px-3 py-2 text-sm cursor-pointer
  text-text-primary hover:text-gold transition;
}

.nav-item {
  @apply px-3 text-sm cursor-pointer
  text-text-primary hover:text-gold transition;
}

/* search */
.search-box {
  @apply relative flex items-center;
}

.search-input {
  @apply w-72 h-10 pl-10 pr-4 rounded-xl
  bg-brand text-text-primary
  border border-graySoft-dark
  focus:outline-none transition;
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

/* panel */
.panel {
  @apply absolute right-0 top-full mt-2
  w-[220px]
  rounded-xl
  bg-[#1a1a1a]
  border border-[#b78f1a]
  shadow-xl z-50;
}

.panel-section {
  @apply py-2;
}

.panel-item {
  @apply block px-4 py-2
  text-white text-sm
  hover:text-[#ffd700]
  hover:bg-[#262626]
  transition-colors;
}
</style>
