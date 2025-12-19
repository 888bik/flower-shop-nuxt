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
                <v-btn
                  v-if="o.payStatus === 'unpaid'"
                  :to="`/pay/${o.orderId}`"
                  color="pink lighten-1"
                  class="text-white px-4 py-1 rounded"
                  elevation="2"
                >
                  去支付
                </v-btn>

                <!-- 查看详情 -->
                <v-btn
                  :to="`/orders/${o.orderId}`"
                  outlined
                  color="pink"
                  class="px-4 py-1 rounded"
                >
                  查看详情
                </v-btn>

                <!-- 查看物流 -->
                <v-btn
                  v-if="o.payStatus !== 'unpaid' && o.payStatus !== 'closed'"
                  @click="openShipInfoModal(o.orderId)"
                  outlined
                  :loading="btnLoading"
                  color="blue"
                  class="px-4 py-1 rounded"
                >
                  查看物流
                </v-btn>

                <v-btn
                  v-if="
                    o.payStatus !== 'unpaid' &&
                    o.payStatus !== 'closed' &&
                    o.shipStatus !== 'received'
                  "
                  color="green"
                  class="text-white px-4 py-1 rounded"
                  elevation="2"
                  @click="openConfirmReceive(o.orderId)"
                >
                  确认收货
                </v-btn>

                <!-- 去评价 -->
                <v-btn
                  v-if="
                    o.payStatus !== 'unpaid' &&
                    o.payStatus !== 'closed' &&
                    o.shipStatus === 'received' &&
                    !o.reviewed
                  "
                  @click="$router.push(`/orders/${o.orderId}/review`)"
                  color="orange"
                  class="text-white px-4 py-1 rounded"
                  elevation="2"
                >
                  去评价
                </v-btn>
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
    <!-- 物流弹窗 -->
    <ShipInfoModal ref="shipInfoModalRef" />

    <!-- 确认收货对话框 -->
    <v-dialog v-model="confirmDialogVisible" max-width="420">
      <v-card>
        <v-card-title class="font-medium">确认收货</v-card-title>
        <v-card-text>
          <div>
            确认收到该订单的商品吗？确认后订单将标记为已收货，无法撤销。
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeConfirm">取消</v-btn>
          <v-btn
            color="green"
            :loading="confirmLoading"
            @click="doConfirmReceive"
            >确认收货</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import ShipInfoModal from "./_components/shipInfoModal.vue";
definePageMeta({ layout: "profile", requiresAuth: true });

const { $api } = useNuxtApp();
const shipInfoModalRef = ref();
const btnLoading = ref(false);
const reviewDialogVisible = ref(false);
const currentOrderId = ref<number | null>(null);
const router = useRouter();

const confirmDialogVisible = ref(false);
const confirmLoading = ref(false);
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
async function openShipInfoModal(orderId: number) {
  currentOrderId.value = orderId;
  shipInfoModalRef.value
    ?.open(orderId)
    .finally(() => (btnLoading.value = false));
}

function handleReviewSubmitted() {
  // 提交成功后刷新列表或更新对应订单状态
  loadList(true);
  reviewDialogVisible.value = false;
}

function openConfirmReceive(orderId: number) {
  currentOrderId.value = orderId;
  confirmDialogVisible.value = true;
}

function closeConfirm() {
  confirmDialogVisible.value = false;
}

async function doConfirmReceive() {
  if (!currentOrderId.value) return;
  try {
    await $api.orders.confirmReceive(currentOrderId.value);
    $toast.success("确认收货成功");
  } catch (error) {
    $toast.error("操作失败，请重新尝试");
  } finally {
    confirmDialogVisible.value = false;
  }
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
