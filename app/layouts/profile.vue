<template>
  <v-app>
    <!-- 顶部栏（用户中心） -->
    <v-app-bar flat height="64" class="bg-[#0F1724] border-b border-white/6">
      <!-- 移动端菜单按钮 -->
      <v-btn icon class="d-md-none" @click="drawer = true">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title class="text-white font-semibold">
        用户中心
      </v-app-bar-title>

      <v-spacer />

      <!-- 返回商城 -->
      <v-btn variant="text" to="/" class="text-gold hover:text-gold">
        <v-icon start>mdi-store</v-icon>返回商城
      </v-btn>

      <!-- 用户 -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar size="36" color="primary">
              {{ initials }}
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="bg-[#0b0b0b]">
          <v-list-item to="/profile" class="hover:text-gold">
            <v-icon start>mdi-account</v-icon>个人中心
          </v-list-item>
          <v-list-item @click="logout" class="hover:text-gold">
            <v-icon start color="white">mdi-logout</v-icon>退出登录
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 移动端抽屉 -->
    <v-navigation-drawer v-model="drawer" temporary class="bg-[#070707]">
      <UserSidebar />
    </v-navigation-drawer>

    <!-- 桌面端侧边栏 -->
    <v-navigation-drawer
      permanent
      width="240"
      class="bg-[#070707] d-none d-md-flex"
    >
      <UserSidebar />
    </v-navigation-drawer>

    <!-- 主内容 -->
    <v-main class="bg-[#0b0b0b]">
      <v-container fluid class="py-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const drawer = ref(false);

const userStore = useUserStore();

const initials = computed(() => {
  const n =
    userStore.userInfo?.user?.nickname ||
    userStore.userInfo?.user?.username ||
    "U";
  return n.slice(0, 1).toUpperCase();
});

const logout = async () => {
  await userStore.logout();
  removeToken("user-token");
  navigateTo("/login");
};
</script>
