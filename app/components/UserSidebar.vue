<template>
  <v-list nav class="text-white">
    <v-list-item class="mb-2" title="个人中心" subtitle="Account Overview" />

    <v-divider class="mb-2" />

    <v-list-item to="/profile" prepend-icon="mdi-account" title="我的资料" />

    <v-list-item
      to="/profile/edit"
      prepend-icon="mdi-account-edit"
      title="编辑资料"
    />

    <v-list-item
      to="/profile/addresses"
      prepend-icon="mdi-map-marker"
      title="地址管理"
    />

    <v-list-item
      to="/profile/bills"
      prepend-icon="mdi-cash"
      title="账单 / 分佣"
    />

    <v-list-item to="/order" prepend-icon="mdi-receipt-text" title="我的订单" />

    <v-divider class="my-2" />

    <v-list-item to="/profile/withdraw" prepend-icon="mdi-bank" title="提现" />
  </v-list>
</template>
