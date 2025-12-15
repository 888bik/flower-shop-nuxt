<template>
  <v-list nav class="text-onSurface">
    <v-list-item class="mb-2" title="个人中心" subtitle="Account Overview" />

    <v-divider class="mb-2" />

    <v-list-item
      to="/profile"
      prepend-icon="mdi-account"
      title="我的资料"
      class="hover:text-primary"
    />

    <v-list-item
      to="/profile/edit"
      prepend-icon="mdi-account-edit"
      title="编辑资料"
      class="hover:text-primary"
    />

    <v-list-item
      to="/profile/addresses"
      prepend-icon="mdi-map-marker"
      title="地址管理"
      class="hover:text-primary"
    />

    <v-list-item
      to="/profile/bills"
      prepend-icon="mdi-cash"
      title="账单 / 分佣"
      class="hover:text-primary"
    />

    <v-list-item
      to="/order"
      prepend-icon="mdi-receipt-text"
      title="我的订单"
      class="hover:text-primary"
    />

    <v-divider class="my-2" />

    <v-list-item
      to="/profile/withdraw"
      prepend-icon="mdi-bank"
      title="提现"
      class="hover:text-primary"
    />
  </v-list>
</template>

<script setup lang="ts">
// 纯展示组件，无逻辑改动
</script>

<style scoped>
.text-onSurface {
  color: var(--c-on-surface);
}
.hover\:text-primary:hover {
  color: var(--c-primary);
}
</style>
