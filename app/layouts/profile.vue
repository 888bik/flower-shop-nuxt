<template>
  <v-app class="theme-pink">
    <!-- 顶部栏（用户中心） -->
    <v-app-bar
      flat
      class="bg-nav border-b border-borderColor h-20 flex items-center justify-center"
    >
      <!-- 移动端菜单按钮 -->
      <v-btn icon class="d-md-none" @click="drawer = true">
        <v-icon class="text-primary">mdi-menu</v-icon>
      </v-btn>

      <v-app-bar-title class="text-text font-semibold">
        用户中心
      </v-app-bar-title>

      <v-spacer />

      <!-- 返回商城：主色为粉色，hover 保持 gold 点缀 -->
      <v-btn variant="text" to="/" class="text-primary hover:text-gold">
        <v-icon start class="text-primary">mdi-store</v-icon> 返回商城
      </v-btn>

      <!-- 用户菜单 -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <!-- 头像使用品牌主色（粉）+ 白字 -->
            <v-avatar size="36" class="bg-primary text-white">
              {{ initials }}
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="bg-surface text-onSurface">
          <v-list-item to="/profile" class="hover:text-primary">
            <v-icon start class="text-onSurface">mdi-account</v-icon>
            <span class="ml-2">个人中心</span>
          </v-list-item>

          <v-list-item @click="logout" class="hover:text-primary">
            <v-icon start class="text-onSurface">mdi-logout</v-icon>
            <span class="ml-2">退出登录</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 移动端抽屉 -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      class="bg-surface text-onSurface"
    >
      <UserSidebar />
    </v-navigation-drawer>

    <!-- 桌面端侧边栏 -->
    <v-navigation-drawer
      permanent
      width="240"
      class="bg-surface d-none d-md-flex text-onSurface border-r border-borderColor"
    >
      <UserSidebar />
    </v-navigation-drawer>

    <!-- 主内容 -->
    <v-main class="bg-page text-text">
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
const authStore = useAuthStore();

const initials = computed(() => {
  const n =
    userStore.userInfo?.user?.nickname ||
    userStore.userInfo?.user?.username ||
    "U";
  return n.slice(0, 1).toUpperCase();
});

const logout = async () => {
  authStore.logout();
  navigateTo("/login");
};
</script>

<style scoped>
/* 顶栏轻微内阴影以分离内容 */
.v-application .v-app-bar {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}

/* 侧边栏卡片感（微圆角 + 轻阴影） */
.v-navigation-drawer {
  border-radius: 10px;
  padding-top: 12px;
}

/* 列表项 hover 的过渡 */
.v-list-item {
  transition: color 120ms ease, background-color 120ms ease;
}

/* 如果你希望顶部栏和侧栏文字更突出： */
.text-onSurface {
  color: var(--c-on-surface);
}
</style>
