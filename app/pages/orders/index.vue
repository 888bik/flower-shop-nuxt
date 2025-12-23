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
              <!-- 支付状态 -->
              <div class="text-sm text-muted mt-2">
                状态：
                <span :class="orderStatusClass(o.payStatus, o.refundStatus)">
                  {{
                    orderStatusText(o.payStatus, o.shipStatus, o.refundStatus)
                  }}
                </span>
              </div>
              <!-- 退款状态 -->
              <div
                v-if="o.refundStatus && o.refundStatus !== 'none'"
                class="text-xs mt-1"
                :class="refundStatusClass(o.refundStatus)"
              >
                {{ refundStatusText(o.refundStatus) }}
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
                  color="pink"
                  class="text-white px-4 py-1 rounded"
                  elevation="2"
                >
                  去支付
                </v-btn>

                <!-- 查看详情 -->
                <v-btn
                  :to="`/orders/${o.orderId}`"
                  outlined
                  color="grey"
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
                    o.shipStatus === 'shipped'
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
                <v-btn
                  v-if="canDelete(o)"
                  @click="openDeleteConfirm(o.orderId)"
                  text
                  color="red"
                  class="px-2"
                >
                  删除订单
                </v-btn>
                <v-btn
                  v-if="canRefund(o)"
                  color="red"
                  outlined
                  class="px-4 py-1 rounded"
                  @click="openRefundDialog(o.orderId)"
                >
                  申请退款
                </v-btn>
                <v-btn
                  v-if="canReturn(o)"
                  color="red"
                  outlined
                  class="px-4 py-1 rounded"
                  @click="openReturnDialog(o.orderId, o.shipStatus)"
                >
                  申请退货
                </v-btn>
                <v-btn
                  v-if="o.refundStatus === 'agreed'"
                  color="blue"
                  outlined
                  class="px-4 py-1 rounded"
                  @click="openReturnShipDialog(o.orderId)"
                >
                  提交退货物流
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
    <!-- 删除订单确认对话框 -->
    <v-dialog v-model="deleteDialogVisible" max-width="420">
      <v-card>
        <v-card-title class="font-medium text-red-600">
          确认删除订单
        </v-card-title>

        <v-card-text class="text-sm text-muted">
          删除后订单记录将无法恢复，确定要删除该订单吗？
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDelete">取消</v-btn>
          <v-btn color="red" :loading="deleteLoading" @click="doDeleteOrder">
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 申请退款 -->
    <v-dialog v-model="refundDialogVisible" max-width="480">
      <v-card>
        <v-card-title class="font-medium text-red-600"> 申请退款 </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="refundReason"
            label="退款原因"
            rows="3"
            placeholder="请填写退款原因"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeRefund">取消</v-btn>
          <v-btn color="red" :loading="refundLoading" @click="submitRefund">
            提交申请
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 申请退货弹窗 -->
    <v-dialog v-model="returnDialogVisible" max-width="480">
      <v-card>
        <v-card-title class="font-medium text-red-600"> 申请退货 </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="returnReason"
            label="退货"
            rows="3"
            placeholder="请填写退货原因"
          />
          <div
            v-if="
              returnShipStatus === 'shipped' || returnShipStatus === 'received'
            "
            class="text-xs text-muted mt-2"
          >
            该订单已发货，提交退货后需用户寄回商品，商家确认后才能退款。
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeReturnDialog">取消</v-btn>
          <v-btn color="red" :loading="returnLoading" @click="submitReturn">
            提交申请
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 提交退货物流信息 -->
    <v-dialog v-model="returnShipDialogVisible" max-width="480">
      <v-card>
        <v-card-title class="font-medium text-red-600">
          提交退货物流
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="returnShipCompany"
            label="物流公司"
            placeholder="请输入物流公司"
          />
          <v-text-field
            v-model="returnShipTrackingNo"
            label="物流单号"
            placeholder="请输入物流单号"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeReturnShipDialog">取消</v-btn>
          <v-btn
            color="red"
            :loading="returnShipLoading"
            @click="submitReturnShip"
          >
            提交
          </v-btn>
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
  refundStatusClass,
  refundStatusText,
} from "~/utils/utils";
import ShipInfoModal from "./_components/shipInfoModal.vue";
definePageMeta({ layout: "profile", requiresAuth: true });

const { $api } = useNuxtApp();
const shipInfoModalRef = ref();
const currentOrderId = ref<number | null>(null);

const btnLoading = ref(false);
const deleteDialogVisible = ref(false);
const deleteLoading = ref(false);
const confirmDialogVisible = ref(false);
const confirmLoading = ref(false);

const refundDialogVisible = ref(false);
const refundLoading = ref(false);
const refundReason = ref("");

// 退货相关状态
const returnDialogVisible = ref(false);
const returnLoading = ref(false);
const returnOrderId = ref<number | null>(null);
const returnShipStatus = ref<string | null>(null);
const returnReason = ref("");
// 退货物流
const returnShipDialogVisible = ref(false);
const returnShipLoading = ref(false);
const returnShipCompany = ref("");
const returnShipTrackingNo = ref("");
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

//确认收货
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
    refresh();
  } catch (error) {
    $toast.error("操作失败，请重新尝试");
  } finally {
    confirmDialogVisible.value = false;
  }
}

//删除订单
function canDelete(o: any) {
  // 1. 未支付订单
  if (o.payStatus === "unpaid") return true;

  // 2. 已关闭订单
  if (o.payStatus === "closed") return true;

  // 3. 已完成并且已评价
  if (o.payStatus === "paid" && o.shipStatus === "received" && o.reviewed) {
    return true;
  }

  // 4. 退款或退货被拒
  if (o.refundStatus === "rejected") return true;

  return false;
}

function openDeleteConfirm(orderId: number) {
  currentOrderId.value = orderId;
  deleteDialogVisible.value = true;
}
function closeDelete() {
  deleteDialogVisible.value = false;
}
async function doDeleteOrder() {
  if (!currentOrderId.value) return;

  deleteLoading.value = true;
  try {
    await $api.orders.deleteOrder([currentOrderId.value]);
    $toast.success("订单已删除");
    refresh();
  } catch (err) {
    $toast.error("删除失败，请稍后再试");
  } finally {
    deleteLoading.value = false;
    deleteDialogVisible.value = false;
  }
}

//判断订单能否退款
function canRefund(o: any) {
  if (o.payStatus !== "paid") return false;
  if (o.shipStatus === "shipped" || o.shipStatus === "received") return false; // 已发货或已收货，不允许仅退款
  if (o.refundStatus && o.refundStatus !== "none") return false;
  return true;
}
function openRefundDialog(orderId: number) {
  currentOrderId.value = orderId;
  refundDialogVisible.value = true;
}
function closeRefund() {
  refundDialogVisible.value = false;
  refundReason.value = "";
}
//申请退款
async function submitRefund() {
  if (!currentOrderId.value) return;
  refundLoading.value = true;

  try {
    // 找到当前订单
    const order = orders.value.find((o) => o.orderId === currentOrderId.value);
    if (!order) throw new Error("订单不存在");

    // 根据发货状态判断退款类型
    const refundType =
      order.shipStatus === "shipped" || order.shipStatus === "received"
        ? "return_refund"
        : "only_refund";

    await $api.orders.applyRefund({
      orderId: currentOrderId.value,
      reason: refundReason.value,
      refundType,
    });

    $toast.success("退款申请已提交");
    refresh();
  } catch (err) {
    $toast.error("申请失败：" + (err instanceof Error ? err.message : ""));
  } finally {
    refundReason.value = "";
    refundLoading.value = false;
    refundDialogVisible.value = false;
  }
}

// 判断是否可以退货
function canReturn(o: any) {
  const payPaid = o.payStatus === "paid";
  const received = o.shipStatus === "received";
  const refundNone = !o.refundStatus || o.refundStatus === "none";
  const refundRejected = o.refundStatus === "rejected";

  // 已支付且已收货，且当前没有有效的退货退款流程
  return payPaid && received && (refundNone || refundRejected);
}

// 打开退货弹窗
function openReturnDialog(orderId: number, shipStatus: string) {
  returnOrderId.value = orderId;
  returnShipStatus.value = shipStatus;
  returnDialogVisible.value = true;
}
// 关闭退货弹窗
function closeReturnDialog() {
  returnDialogVisible.value = false;
  returnOrderId.value = null;
  returnShipStatus.value = null;
}
// 提交退货申请
async function submitReturn() {
  if (!returnOrderId.value) return;
  returnLoading.value = true;

  try {
    await $api.orders.submitReturn({
      orderId: returnOrderId.value,
      reason: returnReason.value,
    });
    $toast.success("退货申请已提交");
    refresh();
  } catch {
    $toast.error("操作失败，请重试");
  } finally {
    returnLoading.value = false;
    closeReturnDialog();
  }
}
function openReturnShipDialog(orderId: number) {
  returnOrderId.value = orderId;
  returnShipDialogVisible.value = true;
}

function closeReturnShipDialog() {
  returnShipDialogVisible.value = false;
  returnShipCompany.value = "";
  returnShipTrackingNo.value = "";
}

// 提交退货物流
async function submitReturnShip() {
  if (!returnOrderId.value) return;
  if (!returnShipCompany.value || !returnShipTrackingNo.value) {
    $toast.error("物流公司和单号不能为空");
    return;
  }

  returnShipLoading.value = true;
  try {
    await $api.orders.submitReturnShip({
      orderId: returnOrderId.value,
      company: returnShipCompany.value,
      trackingNo: returnShipTrackingNo.value,
    });
    $toast.success("退货物流提交成功");
    refresh();
  } catch (err) {
    $toast.error("提交失败：" + (err instanceof Error ? err.message : ""));
  } finally {
    returnShipLoading.value = false;
    closeReturnShipDialog();
  }
}
onMounted(() => loadList(true));
</script>

<style scoped></style>
