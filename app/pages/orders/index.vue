<template>
  <div class="max-w-5xl mx-auto px-6 py-10 theme-pink">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-text mb-6">我的订单</h1>
      <div>
        <v-btn
          @click="refresh"
          :style="{ background: 'var(--c-primary)', color: '#fff' }"
        >
          刷新
        </v-btn>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <ThreeBodyLoader class="w-16 h-16" />
    </div>
    <div v-else>
      <div v-if="orders?.length === 0" class="text-center text-muted py-12">
        暂无订单，快去下单吧
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="o in orders"
          :key="o.orderId"
          class="p-4 rounded-lg border bg-white"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-sm text-muted">订单号：{{ o.orderNo }}</div>
              <div class="text-xs text-muted mt-2">
                下单时间：{{ formatDate(o.createTime) }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-lg font-semibold">
                ¥{{ formatPrice(o.totalPrice) }}
              </div>
              <div class="text-sm text-muted mt-2">
                状态：<span :class="orderStatusClass(o.payStatus)">{{
                  orderStatusText(o.payStatus)
                }}</span>
              </div>
            </div>
          </div>

          <div class="mt-3 grid grid-cols-12 gap-4 items-center">
            <div class="col-span-12 lg:col-span-8 space-y-2">
              <div class="flex gap-3">
                <div
                  v-for="it in (o.items || []).slice(0, 3)"
                  :key="it.goodsId"
                  class="w-20 h-20 rounded overflow-hidden border"
                >
                  <img
                    :src="it.goodsCover"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div class="text-sm text-muted mt-2">
                共 {{ itemCount(o) }} 件 · 小计 ¥{{ formatPrice(o.subtotal) }}
              </div>
            </div>

            <div class="col-span-12 lg:col-span-4 text-right space-y-2">
              <div v-if="o.payStatus === 'unpaid'">
                <span v-if="getRemaining(o.orderId) > 0" class="text-red-500">
                  剩余支付 {{ formatExpire(getRemaining(o.orderId)) }}
                </span>
                <span v-else class="text-muted">已超时</span>
              </div>

              <div class="flex justify-end gap-2 mt-2">
                <NuxtLink
                  v-if="o.payStatus === 'unpaid'"
                  :to="`/pay/${o.orderId}`"
                  class="px-3 py-1 rounded bg-primary text-white"
                  >去支付</NuxtLink
                >
                <NuxtLink
                  :to="`/orders/${o.orderId}`"
                  class="px-3 py-1 rounded border hover:text-primary"
                  :style="{ borderColor: 'var(--c-border)' }"
                  >查看详情</NuxtLink
                >
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            v-if="!allLoaded"
            @click="loadMore"
            class="px-6 py-2 rounded font-medium shadow"
            :style="{ background: '#FC6EA1', color: '#fff' }"
          >
            加载更多
          </button>
          <div v-else class="text-sm text-muted">没有更多了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import {
  formatDate,
  formatExpire,
  formatPrice,
  orderStatusText,
  orderStatusClass,
} from "~/utils/utils";
definePageMeta({ layout: "profile", requiresAuth: true });

const { $api } = useNuxtApp();
const {
  orders,
  loading,
  loadingMore,
  allLoaded,
  remainingMap,
  loadList,
  refresh,
  loadMore,
  itemCount,
} = useOrderList($api, $toast);

function getRemaining(orderId: number): number {
  return remainingMap.value[orderId] ?? 0;
}

onMounted(() => loadList(true));
</script>

<style scoped>
.text-muted {
  color: var(--c-muted);
}
.text-muted {
  color: var(--c-muted);
}
.btn-primary {
  display: inline-block;
  border-radius: 999px;
  font-weight: 600;
  background: linear-gradient(
    90deg,
    var(--c-primary),
    color-mix(in srgb, var(--c-primary) 75%, #ff5a93 25%)
  );
  color: #fff;
}
</style>
