<template>
  <div class="min-h-screen bg-page flex justify-center py-8 px-4 relative">
    <div class="w-full max-w-3xl bg-surface rounded-xl border p-6 space-y-6">
      <div class="flex items-center justify-between">
        <!-- 左边 -->
        <div class="flex flex-1 items-center h-0">
          <GoBackButton @click="$router.back()" />
        </div>
        <div class="flex items-center">
          <h1 class="text-2xl font-semibold leading-none">订单详情</h1>
        </div>

        <!-- 右边 -->
        <div class="flex flex-1 items-center justify-end gap-3">
          <button
            class="px-3 py-2 rounded-md border hover:text-gold"
            :style="{ borderColor: 'var(--c-border)' }"
            @click="dialogVisible = true"
            v-if="order?.payStatus === 'unpaid'"
          >
            取消订单
          </button>

          <span :class="orderStatusClass(order?.payStatus)">
            {{ orderStatusText(order?.payStatus) }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm text-muted">
        <div>
          订单号：<span class="text-text">{{ order?.orderNo }}</span>
        </div>
        <div class="text-right">
          下单时间：{{ formatDate(order?.createTime) }}
        </div>

        <div>
          收货人：<span class="text-text"
            >{{ order?.address?.name }} · {{ order?.address?.phone }}</span
          >
        </div>
        <div class="text-right" v-if="order?.payStatus === 'paid'">
          物流状态：<span class="text-text">{{
            orderShippingText(order?.shipStatus) || "-"
          }}</span>
        </div>
      </div>

      <div
        v-if="remainingSeconds > 0 && order?.payStatus === 'unpaid'"
        class="text-red-500"
      >
        请在
        <span class="font-medium">{{ formatExpire(remainingSeconds) }}</span>
        内完成支付
      </div>
      <!-- <div v-else-if="order?.payStatus === 'UNPAID'" class="text-sm text-muted">
        该订单已超过支付时限，可能已被关闭
      </div> -->

      <!-- address card -->
      <div class="p-4 rounded-lg border bg-white">
        <div class="font-medium">
          {{ order?.address?.name }} · {{ order?.address?.phone }}
        </div>
        <div class="text-sm text-muted mt-1">
          {{ order?.address?.province }} {{ order?.address?.city }}
          {{ order?.address?.district }} {{ order?.address?.address }}
        </div>
      </div>

      <div>
        <h2 class="text-lg font-medium mb-3">商品清单</h2>
        <div class="space-y-3">
          <div
            v-for="it in order?.items ?? []"
            :key="it.goodsId"
            class="flex items-center gap-4 p-3 border rounded-lg bg-white"
          >
            <img
              :src="it.goodsCover"
              class="w-20 h-20 object-cover rounded"
              alt=""
            />
            <div class="flex-1">
              <div class="font-medium">{{ it.goodsTitle }}</div>
              <div class="text-sm text-muted">
                单价：¥{{ formatPrice(it.price) }} · 数量：{{ it.num }}
              </div>
            </div>
            <div class="font-semibold">¥{{ formatPrice(it.subtotal) }}</div>
          </div>
          <div
            v-if="!(order?.items && order.items.length)"
            class="text-center text-muted py-6"
          >
            无商品信息
          </div>
        </div>
      </div>

      <div class="p-4 rounded-lg border bg-white text-right space-y-2">
        <div class="flex justify-between">
          <span>商品小计</span><span>¥{{ formatPrice(order?.subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span>运费</span><span>¥{{ formatPrice(order?.shipping) }}</span>
        </div>
        <div class="flex justify-between">
          <span>优惠</span><span>- ¥{{ formatPrice(order?.discount) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg">
          <span>应付总额</span
          ><span>¥{{ formatPrice(order?.totalPrice) }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div v-if="order?.payStatus === 'unpaid'">
          <NuxtLink
            :to="`/pay/${orderId}`"
            class="w-full block text-center py-3 rounded-full btn-primary"
            >去支付</NuxtLink
          >

          <div
            v-if="remainingSeconds > 0"
            class="text-xs text-muted text-center mt-2"
          >
            或者你可以在支付页选择模拟支付方式
          </div>
        </div>

        <div v-else-if="order?.payStatus === 'paid'">
          <div class="text-center text-sm text-green-600">
            已支付 — 谢谢你的购买
          </div>
          <NuxtLink
            to="/orders"
            class="text-sm text-muted underline mt-2 text-center"
            >返回订单列表</NuxtLink
          >
          <NuxtLink
            to="/"
            class="text-sm text-muted underline mt-2 text-center ml-3"
            >返回商城首页</NuxtLink
          >
        </div>

        <div v-else class="text-center text-sm text-muted">
          订单状态：{{ orderStatusText(order?.payStatus) }}
        </div>
      </div>
    </div>
  </div>

  <v-dialog v-model="dialogVisible" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-information"
      text="取消订单后，订单将无法恢复，您确定要取消吗？"
      title="确定取消订单？"
    >
      <template v-slot:actions>
        <v-btn text @click="dialogVisible = false">取消</v-btn>
        <v-btn class="ms-auto" text color="red" @click="confirmCancel"
          >确定</v-btn
        >
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  orderStatusText,
  formatDate,
  formatPrice,
  orderShippingText,
  orderStatusClass,
} from "~/utils/utils";
import type { OrderDetailResponse } from "~/types/api/orders";
import GoBackButton from "~/assets/base-ui/GoBackButton.vue";

definePageMeta({ layout: "empty", requiresAuth: true });

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();

const orderId = Number(route.params.orderId);
const order = ref<OrderDetailResponse>();
const timer = ref<number | null>(null);
const remainingSeconds = ref<number>(0);

const dialogVisible = ref(false);

async function loadOrder() {
  try {
    const res = await $api.orders.getOrderDetail(orderId);
    order.value = res;
    computeRemaining(res);
  } catch (e) {
    $toast.error("获取订单失败");
    router.replace("/orders");
  }
}

function computeRemaining(o: any) {
  remainingSeconds.value = 0;
  if (!o) return;
  const expire = o.expireTime;
  if (!expire) return;

  const now = Math.floor(Date.now() / 1000);
  let remain = 0;
  if (expire > 1_000_000_000) {
    remain = expire - now;
  } else {
    remain = expire;
  }
  remainingSeconds.value = Math.max(remain, 0);
  if (timer.value) clearInterval(timer.value);
  if (remainingSeconds.value > 0) {
    timer.value = setInterval(() => {
      remainingSeconds.value = Math.max(remainingSeconds.value - 1, 0);
      if (remainingSeconds.value <= 0 && timer.value) {
        clearInterval(timer.value);
        timer.value = null;
        loadOrder();
      }
    }, 1000) as unknown as number;
  }
}

const confirmCancel = async () => {
  try {
    await $api.orders.cancelOrder(orderId);
    $toast.success("取消成功");
  } catch (error) {
    $toast.error("取消失败，请稍后重试");
  } finally {
    dialogVisible.value = false;
  }
};

onMounted(() => {
  loadOrder();
});

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});

function formatExpire(sec: number) {
  if (!sec || sec <= 0) return "00:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0)
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
</script>

<style scoped>
.bg-page {
  background-color: var(--c-bg);
}
.bg-surface {
  background-color: var(--c-surface);
}
.text-muted {
  color: var(--c-muted);
}
.text-text {
  color: var(--c-text);
}
.btn-primary {
  display: inline-block;
  width: 100%;
  border-radius: 999px;
  font-weight: 600;
  background: linear-gradient(
    90deg,
    var(--c-primary),
    color-mix(in srgb, var(--c-primary) 75%, #ff5a93 25%)
  );
  color: #fff;
  box-shadow: 0 8px 26px rgba(255, 111, 163, 0.12);
}
.border {
  border-color: var(--c-border);
}
</style>
