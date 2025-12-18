<template>
  <div class="min-h-screen bg-page py-10 text-text">
    <div class="mx-auto max-w-6xl px-4">
      <h1 class="text-2xl font-semibold text-primary-on mb-6 text-gold">
        订单结算
      </h1>

      <!-- 主布局：左侧独立滚动区 + 右侧 sticky sidebar -->
      <div class="checkout-layout grid grid-cols-12 gap-6">
        <!-- LEFT: 主内容（包一层 left-scroll，让它内部滚动） -->
        <div class="col-span-12 lg:col-span-8">
          <div class="left-scroll">
            <!-- 收货地址 -->
            <div
              class="p-4 rounded-xl bg-surface border mb-6"
              :style="{ borderColor: 'var(--c-border)' }"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div v-if="selectedAddress" class="flex items-start gap-4">
                    <div
                      class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-xl"
                    >
                      <span class="font-medium">
                        <v-icon icon="mdi-map-marker"></v-icon>
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-text">
                        {{ selectedAddress.name }} · {{ selectedAddress.phone }}
                      </div>
                      <div class="text-sm text-muted mt-1">
                        {{ selectedAddress.province }}
                        {{ selectedAddress.city }}
                        {{ selectedAddress.district }}
                        {{ selectedAddress.address }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-muted">
                    未选择收货地址，请先添加或选择地址
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-2 rounded-md border"
                    :style="{ borderColor: 'var(--c-border)' }"
                    @click="goAddresses"
                  >
                    管理地址
                  </button>
                  <button
                    class="px-3 py-2 rounded-md bg-primary text-white"
                    @click="openAddressSelector"
                  >
                    选择地址
                  </button>
                </div>
              </div>
            </div>

            <!-- 商品列表 -->
            <div
              class="p-4 rounded-xl bg-surface border mb-6"
              :style="{ borderColor: 'var(--c-border)' }"
            >
              <div class="text-lg font-medium mb-3">
                商品清单（{{ selectedItems.length }} 件）
              </div>
              <div class="space-y-3">
                <div
                  v-for="item in selectedItems"
                  :key="item.id"
                  class="flex gap-4 rounded-lg p-3 items-center border"
                  :style="{ borderColor: 'var(--c-border)' }"
                >
                  <NuxtLink
                    :to="`/goods/${item.goodsId}`"
                    class="block w-20 h-20 rounded overflow-hidden shrink-0"
                  >
                    <img
                      :src="item.cover"
                      alt=""
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </NuxtLink>

                  <div class="flex-1 min-w-0">
                    <div class="font-medium truncate">{{ item.title }}</div>
                    <div class="text-sm text-muted mt-1 truncate">
                      {{ item.skuTitle || item.unit || "" }}
                    </div>
                    <div class="mt-2 flex items-center justify-between">
                      <div>
                        <div class="text-lg font-semibold text-primary">
                          ¥{{ formatPrice(item.minPrice) }}
                        </div>
                        <div
                          v-if="
                            item.minOprice &&
                            Number(item.minOprice) > Number(item.minPrice)
                          "
                          class="text-sm line-through text-muted"
                        >
                          ¥{{ formatPrice(item.minOprice) }}
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <button
                          class="px-2 py-1 rounded border disabled:opacity-40"
                          :disabled="item.num <= 1"
                          @click="changeNum(item, -1)"
                          aria-label="减少数量"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          class="w-14 text-center rounded border p-1"
                          v-model.number="item.num"
                          @change="onNumInput(item)"
                          min="1"
                          :max="item.stock ?? 9999"
                        />
                        <button
                          class="px-2 py-1 rounded border disabled:opacity-40"
                          :disabled="item.num >= (item.stock ?? 9999)"
                          @click="changeNum(item, 1)"
                          aria-label="增加数量"
                        >
                          +
                        </button>
                        <button
                          class="ml-3 text-sm text-muted hover:text-red-600"
                          @click="removeItem(item)"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="selectedItems.length === 0"
                  class="text-center text-muted py-10"
                >
                  购物车为空或未选中商品。
                </div>
              </div>
            </div>

            <!-- 配送方式 / 支付方式 / 优惠券 -->
            <div
              class="p-4 rounded-xl bg-surface border space-y-4 mb-6"
              :style="{ borderColor: 'var(--c-border)' }"
            >
              <div>
                <div class="text-sm text-muted">配送方式</div>
                <div class="mt-2 flex gap-3">
                  <button
                    v-for="m in shipMethods"
                    :key="m.value"
                    @click="shippingType = m.value"
                    :class="[
                      'px-3 py-2 rounded-md',
                      shippingType === m.value
                        ? 'bg-primary text-white'
                        : 'border',
                    ]"
                    :style="
                      shippingType === m.value
                        ? {}
                        : { borderColor: 'var(--c-border)' }
                    "
                  >
                    {{ m.label }}
                  </button>
                </div>
              </div>

              <div>
                <div class="text-sm text-muted">支付方式</div>
                <div class="mt-2 flex gap-3">
                  <button
                    v-for="p in payMethods"
                    :key="p.value"
                    @click="paymentMethod = p.value"
                    :class="[
                      'px-3 py-2 rounded-md',
                      paymentMethod === p.value
                        ? 'bg-primary text-white'
                        : 'border',
                    ]"
                    :style="
                      paymentMethod === p.value
                        ? {}
                        : { borderColor: 'var(--c-border)' }
                    "
                  >
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <div>
                <div class="text-sm text-muted">优惠券</div>
                <div class="mt-2 flex items-center gap-3">
                  <select
                    v-model="selectedCouponId"
                    class="rounded border p-2"
                    :style="{ borderColor: 'var(--c-border)' }"
                  >
                    <option :value="null">-- 不使用优惠券 --</option>
                    <option
                      v-for="c in availableCoupons"
                      :key="c.id"
                      :value="c.id"
                    >
                      {{ c.type === 0 ? `¥${c.value}` : `${c.value}折` }} · 满{{
                        c.minPrice
                      }}
                      · 剩余{{ c.stock }}
                    </option>
                  </select>
                  <div v-if="appliedCoupon" class="text-sm text-muted">
                    已应用：<span class="font-medium">{{
                      appliedCoupon.name
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="text-xs text-muted">
                注：实际优惠以结算页最终结果为准，运费在确认页面计算。
              </div>
            </div>
          </div>
          <!-- /.left-scroll -->
        </div>

        <!-- RIGHT: 订单概览（sticky） -->
        <div class="col-span-12 lg:col-span-4">
          <div
            class="order-sidebar rounded-xl border p-6 bg-surface"
            :style="{ borderColor: 'var(--c-border)' }"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-text-primary">订单概览</h3>
              <button class="text-sm text-muted" @click="refreshAll">
                刷新
              </button>
            </div>

            <div class="flex justify-between text-sm mb-2">
              <span>商品小计</span
              ><span>¥{{ formatPrice(itemsSubtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span>运费</span><span>¥{{ formatPrice(shippingFee) }}</span>
            </div>
            <div v-if="appliedCoupon" class="flex justify-between text-sm mb-2">
              <span>优惠（{{ appliedCoupon.name }}）</span>
              <span class="text-rose-600"
                >-¥{{ formatPrice(couponDiscount) }}</span
              >
            </div>
            <div class="border-t my-3"></div>

            <div class="flex justify-between items-baseline mb-4">
              <div>
                <div class="text-sm text-muted">应付总额</div>
                <div class="text-2xl font-semibold text-primary">
                  ¥{{ formatPrice(totalPayable) }}
                </div>
              </div>
              <div class="text-sm text-muted">
                共
                {{ selectedItems.reduce((s, i) => s + Number(i.num || 0), 0) }}
                件
              </div>
            </div>

            <div class="space-y-2">
              <button
                class="w-full py-3 rounded-full btn-primary"
                :disabled="
                  placing || selectedItems.length === 0 || !selectedAddress
                "
                @click="placeOrder"
              >
                <span v-if="placing">正在下单…</span>
                <span v-else>去支付</span>
              </button>

              <button
                class="w-full py-3 rounded-full border"
                :style="{ borderColor: 'var(--c-border)' }"
                @click="saveForLater"
              >
                保存为稍后
              </button>
            </div>

            <div v-if="placeError" class="mt-3 text-sm text-rose-500">
              {{ placeError }}
            </div>
          </div>
        </div>
      </div>
      <!-- /.checkout-layout -->
    </div>

    <!-- mobile bottom bar -->
    <div
      class="fixed left-0 right-0 bottom-0 z-50 md:hidden mobile-checkout-bar"
    >
      <div
        class="max-w-6xl mx-auto px-4 flex items-center justify-between py-3 bg-surface border-t"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <div>
          <div class="text-sm text-muted">合计</div>
          <div class="text-lg font-semibold text-primary">
            ¥{{ formatPrice(totalPayable) }}
          </div>
        </div>
        <button
          class="rounded-full btn-primary px-4 py-2"
          :disabled="placing || selectedItems.length === 0 || !selectedAddress"
          @click="placeOrder"
        >
          去支付
        </button>
      </div>
    </div>

    <!-- 地址选择对话框 -->
    <v-dialog v-model="showAddressModal" max-width="720">
      <v-card>
        <v-card-title>选择收货地址</v-card-title>
        <v-card-text>
          <div v-if="addresses.length === 0" class="text-muted">
            暂无地址，请先添加
          </div>
          <ul class="space-y-3">
            <li
              v-for="a in addresses"
              :key="a.id"
              class="p-3 border rounded flex items-center justify-between"
              :style="{ borderColor: 'var(--c-border)' }"
            >
              <div>
                <div class="font-medium">{{ a.name }} · {{ a.phone }}</div>
                <div class="text-sm text-muted">
                  {{ a.province }} {{ a.city }} {{ a.district }} {{ a.address }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="px-3 py-1 rounded border"
                  :style="{ borderColor: 'var(--c-border)' }"
                  @click="chooseAddress(a)"
                >
                  选择
                </button>
                <button
                  class="px-3 py-1 rounded border"
                  :style="{ borderColor: 'var(--c-border)' }"
                  @click="editAddress(a)"
                >
                  编辑
                </button>
              </div>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="showAddressModal = false">取消</v-btn>
          <v-btn color="primary" variant="tonal" @click="goAddresses"
            >新增地址</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "~/stores/cart";
import type { CartItem as CartItemType } from "~/types/api/cart";
import type { CouponItem } from "~/types/api/coupon";
import type { AddressItem } from "~/types/api/addresses";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const { $api } = useNuxtApp();

const selectedIdsFromQuery = computed(() => {
  const q = route.query.carts;
  if (!q) return [];
  const s = Array.isArray(q) ? q.join(",") : String(q);
  return s
    .split(",")
    .map((x) => Number(x))
    .filter((n) => !Number.isNaN(n));
});

const selectedItems = computed(() => {
  const list = cartList.value ?? [];
  if (selectedIdsFromQuery.value.length) {
    return list.filter(
      (i) => selectedIdsFromQuery.value.includes(i.id) && i.valid
    );
  }
  return list.filter((i) => i.checked && i.valid);
});

const addresses = ref<AddressItem[]>([]);
const selectedAddress = ref<AddressItem | null>(null);
const showAddressModal = ref(false);

const placing = ref(false);
const placeError = ref<string | null>(null);

const shipMethods = [
  { value: "standard", label: "普通快递（2-4 天）" },
  { value: "express", label: "加急快递（次日达）" },
];
const payMethods = [
  { value: "WECHAT", label: "微信支付" },
  { value: "ALIPAY", label: "支付宝" },
];
const shippingType = ref("standard");
const paymentMethod = ref("WECHAT");

const availableCoupons = ref<CouponItem[]>([]);
const selectedCouponId = ref<number | null>(null);

// cart & selections
const cartList = computed<CartItemType[]>(() => cartStore.list ?? []);

const itemsSubtotal = computed(() =>
  selectedItems.value.reduce(
    (s, it) => s + Number(it.minPrice) * Number(it.num || 1),
    0
  )
);

const shippingFee = computed(() => {
  return shippingType.value === "express" ? 20 : 10;
});

const appliedCoupon = computed(() => {
  return (
    availableCoupons.value.find((c) => c.id === selectedCouponId.value) ?? null
  );
});

const couponDiscount = computed(() => {
  const c = appliedCoupon.value;
  if (!c) return 0;
  const subtotal = itemsSubtotal.value;
  if (subtotal < Number(c.minPrice ?? 0)) return 0;
  if (c.type === 0) {
    return Math.min(Number(c.value ?? 0), subtotal);
  } else {
    const rate = Number(c.value ?? 10) / 10;
    return Math.round(subtotal * (1 - rate) * 100) / 100;
  }
});

const totalPayable = computed(() => {
  const raw = itemsSubtotal.value + shippingFee.value - couponDiscount.value;
  return raw > 0 ? raw : 0;
});

// helpers
function formatPrice(v: any) {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return "0.00";
  return (Math.round(n * 100) / 100).toFixed(2);
}

function addressInitials() {
  if (!selectedAddress.value) return "U";
  const n = selectedAddress.value.name || selectedAddress.value.address || "";
  return n.slice(0, 1).toUpperCase();
}

// load data
async function loadAddresses() {
  try {
    const res = await $api.addresses.getAddressList();
    addresses.value = res?.list ?? res ?? [];
    const def = addresses.value.find((a) => a.isDefault);
    if (def) selectedAddress.value = def;
    else if (addresses.value.length)
      selectedAddress.value = addresses.value[0] ?? null;
  } catch (e) {
    $toast.error(`加载地址失败:${e}`);
  }
}

async function loadCoupons() {
  try {
    const res = await $api.coupon.getUserCouponList();
    availableCoupons.value = (res?.list ?? []).map((c: any) => ({ ...c }));
  } catch (e) {
    $toast.error(`获取优惠卷失败:${e}`);
  }
}

async function refreshAll() {
  await cartStore.fetchCart();
  await loadAddresses();
  await loadCoupons();
  $toast.success("刷新成功");
}

// quantity updates: immediate UI + debounce sync to store
const pendingTimers = new Map<number, number>();

function scheduleUpdateNum(id: number, num: number) {
  // clear previous
  const prev = pendingTimers.get(id);
  if (prev) clearTimeout(prev);
  const t = setTimeout(() => {
    // call store API
    cartStore.updateNum(id, num);
    pendingTimers.delete(id);
  }, 400) as unknown as number;
  pendingTimers.set(id, t);
}

function changeNum(item: CartItemType, step: number) {
  const next = (item.num ?? 0) + step;
  if (next < 1) return;
  if (item.stock != null && next > item.stock) {
    $toast?.error?.("已达到库存上限");
    return;
  }
  item.num = next;
  // schedule store update
  scheduleUpdateNum(item.id, item.num);
}

function onNumInput(item: CartItemType) {
  let val = Number(item.num || 1);
  if (Number.isNaN(val) || val < 1) val = 1;
  if (item.stock != null && val > item.stock) val = item.stock;
  item.num = val;
  scheduleUpdateNum(item.id, item.num);
}

async function removeItem(item: CartItemType) {
  if (!confirm("确认删除该商品？")) return;
  try {
    // 乐观删除本地
    const idx = cartList.value.findIndex((i) => i.id === item.id);
    if (idx >= 0) cartList.value.splice(idx, 1);
    await cartStore.removeFromCart(item.id);
    $toast?.success?.("已移除");
  } catch (e) {
    console.error(e);
    $toast?.error?.("删除失败");
    await cartStore.fetchCart();
  }
}

function saveForLater() {
  selectedItems.value.forEach((i) => (i.checked = false));
  $toast?.success?.("已保存为稍后购买");
}

function openAddressSelector() {
  showAddressModal.value = true;
}
function chooseAddress(a: AddressItem) {
  selectedAddress.value = a;
  showAddressModal.value = false;
}
function editAddress(a: AddressItem) {
  router.push(`/profile/addresses?edit=${a.id}`);
}
function goAddresses() {
  router.push("/profile/addresses");
}

// place order
async function placeOrder() {
  if (selectedItems.value.length === 0) {
    $toast?.error?.("请选择商品");
    return;
  }
  if (!selectedAddress.value) {
    $toast?.error?.("请选择收货地址");
    return;
  }

  placing.value = true;
  placeError.value = null;

  try {
    const items = selectedItems.value.map((i) => ({
      goodsId: i.goodsId,
      skuId: i.skuId ?? 0,
      num: i.num,
    }));

    const payload = {
      addressId: selectedAddress.value.id,
      items,
      couponId: selectedCouponId.value,
      shippingType: shippingType.value,
      remark: "",
    };

    const res = await $api.orders.createOrder(payload);
    $toast?.success?.("下单成功，跳转支付");
    const oid = (res && res.orderId) || "";
    router.push(`/pay/${oid}`);
  } catch (err: any) {
    placeError.value = err?.message || "下单失败，请稍后重试";
    $toast?.error(placeError.value ?? "");
  } finally {
    placing.value = false;
  }
}

// lifecycle
onMounted(async () => {
  await cartStore.fetchCart();
  await loadAddresses();
  await loadCoupons();
});
</script>

<style scoped>
/* 基本色彩 */
.bg-page {
  background-color: var(--c-bg);
}
.text-muted {
  color: var(--c-muted);
}
.text-text {
  color: var(--c-text);
}

/* 按钮样式 */
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
  box-shadow: 0 8px 26px rgba(255, 111, 163, 0.12);
}

/* 主布局调整：保持 grid 列结构，同时控制左侧内部滚动 */
.checkout-layout {
  /* Tailwind grid 列已定义在模板类上，这里只保证最小高度 */
  min-height: calc(
    100vh - 96px
  ); /* 留出顶部 header 空间：按实际 header 高度调整 */
}

/* 左侧的内部滚动区域（桌面有效）：
   max-height 需要根据 header + 页内间距调整（此处示例：96px header + 84px 其他间距 => 180）
*/
.left-scroll {
  max-height: calc(100vh - 180px);
  overflow: auto;
  padding-right: 8px; /* 防止 scrollbar 覆盖内容 */
}

/* 右侧 sidebar sticky */
.order-sidebar {
  position: sticky;
  top: 24px; /* 你可以改成更大的值（例如 96px）以配合全局 header */
  align-self: start;
}

/* 移动端回退：取消左侧内滚动、sidebar 变为普通流 */
@media (max-width: 1024px) {
  .left-scroll {
    max-height: none;
    overflow: visible;
  }
  .order-sidebar {
    position: static;
    top: auto;
  }

  /* mobile bottom bar 覆盖时给页面底部一点间距 */
  .min-h-screen {
    padding-bottom: 84px;
  }
}

/* 可选：微调图片和文本截断，防止宽度溢出 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
