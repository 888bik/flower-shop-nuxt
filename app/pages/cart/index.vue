<template>
  <div class="min-h-screen bg-page py-10 text-text">
    <div class="mx-auto max-w-6xl px-4">
      <!-- 标题 + 操作 -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <h1 class="text-2xl font-semibold text-primary-on">我的购物车</h1>

        <div class="flex items-center gap-3">
          <button
            class="text-sm px-3 py-2 rounded-full border bg-surface hover:bg-opacity-95"
            @click="refresh"
            aria-label="刷新购物车"
          >
            刷新
          </button>
          <button
            class="text-sm px-3 py-2 rounded-full border bg-red-50 text-red-600 hover:opacity-95"
            :disabled="cartList.length === 0"
            @click="confirmClearCart"
            aria-label="清空购物车"
          >
            清空购物车
          </button>
        </div>
      </div>

      <v-empty-state
        v-if="!cartStore.loading && cartList.length === 0"
        icon="mdi-cart-outline"
      >
        <template #title>
          <span class="text-[#2d2d2d]"> 购物车还是空的 </span>
        </template>

        <template #text>
          <span class="text-[#8b8b8b]"> 先去逛逛商品吧 </span>
        </template>
        <template #actions>
          <v-btn color="primary" variant="tonal" to="/"> 去逛逛商品 </v-btn>
        </template>
      </v-empty-state>

      <template v-else>
        <!-- 主布局：左侧独立滚动 + 右侧 sticky 结算栏 -->
        <div class="checkout-layout grid grid-cols-12 gap-6">
          <!-- 列表区（左） -->
          <div class="col-span-12 lg:col-span-8">
            <!-- 左侧内部滚动容器 -->
            <div class="left-scroll">
              <!-- 全选条 -->
              <div
                class="flex items-center justify-between p-3 rounded-lg border surface-card mb-4"
              >
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    class="w-4 h-4"
                    :checked="allChecked"
                    @change="toggleSelectAll"
                    aria-label="全选"
                  />
                  <span class="font-medium">全选</span>
                  <span class="text-sm text-muted"
                    >（{{ cartList.length }} 件，{{
                      disabledCount
                    }}
                    件不可选）</span
                  >
                </div>

                <div class="text-sm text-muted">
                  已选
                  <span class="font-semibold text-primary">{{
                    checkedCount
                  }}</span>
                  件
                </div>
              </div>

              <!-- item 列表 -->
              <div class="space-y-4">
                <div
                  v-for="item in cartList"
                  :key="item.id"
                  class="flex gap-4 rounded-xl border p-4 cart-card"
                  :class="{ 'opacity-50 pointer-events-none': !item.valid }"
                  role="group"
                  aria-labelledby="'cart-item-'+item.id"
                >
                  <!-- checkbox -->
                  <div class="flex items-start pt-1">
                    <input
                      type="checkbox"
                      v-model="item.checked"
                      :disabled="!item.valid"
                      class="w-5 h-5"
                    />
                  </div>

                  <!-- image -->
                  <NuxtLink
                    :to="`/goods/${item.goodsId}`"
                    class="block w-24 h-24 rounded-lg overflow-hidden shrink-0"
                  >
                    <img
                      :src="item.cover"
                      alt=""
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </NuxtLink>

                  <!-- info -->
                  <div class="flex flex-1 flex-col">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          :id="'cart-item-' + item.id"
                          class="font-medium text-text-primary"
                        >
                          <NuxtLink
                            :to="`/goods/${item.goodsId}`"
                            class="hover:underline"
                            >{{ item.title }}</NuxtLink
                          >
                        </h3>
                        <p class="text-sm text-muted mt-1">
                          {{ item.skuTitle || item.unit || "" }}
                        </p>
                      </div>

                      <button
                        class="text-sm text-muted hover:text-red-600"
                        @click="confirmRemove(item)"
                      >
                        删除
                      </button>
                    </div>

                    <div class="mt-auto flex items-center justify-between">
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

                      <!-- qty control -->
                      <div class="flex items-center gap-2 qty-control">
                        <button
                          class="px-3 py-1 rounded border disabled:opacity-40"
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
                          aria-label="数量"
                        />
                        <button
                          class="px-3 py-1 rounded border disabled:opacity-40"
                          :disabled="item.num >= (item.stock ?? 9999)"
                          @click="changeNum(item, 1)"
                          aria-label="增加数量"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 结算侧栏（右，sticky） -->
          <div class="col-span-12 lg:col-span-4">
            <div class="sticky top-24 rounded-xl border p-6 checkout-card">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-text-primary">订单结算</h3>
                <button
                  class="text-sm text-muted hover:text-primary"
                  @click="selectAllValid(true)"
                >
                  全选可购买项
                </button>
              </div>

              <div class="flex justify-between text-sm">
                <span>已选商品</span>
                <span class="font-semibold">{{ checkedCount }} 件</span>
              </div>

              <div class="flex justify-between text-sm">
                <span>小计</span>
                <span class="font-semibold text-primary"
                  >¥{{ formatPrice(subtotal) }}</span
                >
              </div>

              <div class="text-xs text-muted">运费与税费将在结算页计算</div>

              <button
                class="mt-2 w-full rounded-full btn-primary"
                :disabled="checkedCount === 0"
                @click="proceedToCheckout"
              >
                去结算（{{ checkedCount }}）
              </button>

              <button
                class="w-full rounded-full border py-2 text-muted hover:text-primary"
                @click="saveForLater"
                v-if="checkedCount > 0"
              >
                保存为稍后购买
              </button>
            </div>
          </div>
        </div>
        <!-- /.checkout-layout -->
      </template>
    </div>

    <!-- mobile bottom bar -->
    <div
      class="fixed left-0 right-0 bottom-0 z-50 md:hidden mobile-checkout-bar"
    >
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="allChecked"
            @change="toggleSelectAll"
          />
          <div>
            <div class="text-sm">
              已选
              <span class="font-semibold text-primary">{{ checkedCount }}</span>
              件
            </div>
            <div class="text-sm text-muted">
              合计 ¥{{ formatPrice(subtotal) }}
            </div>
          </div>
        </div>

        <button
          class="ml-4 rounded-full btn-primary px-4 py-2 text-white"
          :disabled="checkedCount === 0"
          @click="proceedToCheckout"
        >
          去结算
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { CartItem as CartItemType } from "~/types/api/cart";

const router = useRouter();
const cartStore = useCartStore();

// 绑定 store 列表（响应式）
const cartList = computed<CartItemType[]>(() => cartStore.list ?? []);

// 初次加载
onMounted(() => {
  cartStore.fetchCart();
});

/** 格式化金钱（确保两位小数） */
function formatPrice(v: any) {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return "0.00";
  return (Math.round(n * 100) / 100).toFixed(2);
}

/** 统计：已选数量（仅有效且被勾选） */
const checkedCount = computed(
  () => cartList.value.filter((i) => i.checked && i.valid).length
);

/** 统计：被禁用（invalid）数量 */
const disabledCount = computed(
  () => cartList.value.filter((i) => !i.valid).length
);

/** 全选状态 */
const allChecked = computed({
  get: () => {
    const validItems = cartList.value.filter((i) => i.valid);
    if (!validItems.length) return false;
    return validItems.every((i) => i.checked);
  },
  set: (v: boolean) => {
    cartList.value.forEach((i) => {
      if (i.valid) i.checked = v;
    });
  },
});

/** 小计（已选项） */
const subtotal = computed(() => {
  return cartList.value
    .filter((i) => i.checked && i.valid)
    .reduce((s, it) => s + Number(it.minPrice) * Number(it.num || 1), 0);
});

function toggleSelectAll() {
  const should = !allChecked.value;
  cartList.value.forEach((i) => {
    if (i.valid) i.checked = should;
  });
}

function selectAllValid(v = true) {
  cartList.value.forEach((i) => {
    if (i.valid) i.checked = v;
  });
}

/** 改数量：本地乐观,调用请求 */
const changeNum = async (item: CartItemType, step: number) => {
  const next = (item.num || 0) + step;
  if (next < 1) return;
  if (item.stock != null && next > item.stock) {
    $toast?.error?.("已达到库存上限");
    return;
  }

  // 本地更新（立即反馈）
  item.num = next;

  try {
    await cartStore.updateNum(item.id, next);
  } catch (err) {
    console.error(err);
    $toast?.error?.("更新数量失败");
    item.num = Math.max(1, item.num - step);
  }
};

const onNumInput = (item: CartItemType) => {
  let val = Number(item.num || 1);
  if (Number.isNaN(val) || val < 1) val = 1;
  if (item.stock != null && val > item.stock) val = item.stock;
  item.num = val;
  changeNum(item, 0);
};

function confirmRemove(item: CartItemType) {
  if (!confirm("确认删除该商品？")) return;
  removeItem(item);
}

const removeItem = async (item: CartItemType) => {
  try {
    const idx = cartList.value.findIndex((i) => i.id === item.id);
    if (idx >= 0) cartList.value.splice(idx, 1);

    await cartStore.removeFromCart(item.id);

    $toast?.success?.("已移除");
  } catch (err) {
    console.error(err);
    $toast?.error?.("删除失败");
    cartStore.fetchCart();
  }
};

function confirmClearCart() {
  if (!confirm("确认清空购物车？")) return;
  clearCart();
}

const clearCart = async () => {
  try {
    //清空本地购物车数据
    cartStore.clearLocal();

    await cartStore.clearCart();

    $toast?.success?.("购物车已清空");
  } catch (err) {
    console.error(err);
    $toast?.error?.("清空失败");
    cartStore.fetchCart();
  }
};

function saveForLater() {
  cartList.value.forEach((i) => {
    if (i.checked && i.valid) i.checked = false;
  });
  $toast?.success?.("已保存为稍后购买");
}

function proceedToCheckout() {
  const selected = cartList.value
    .filter((i) => i.checked && i.valid)
    .map((i) => i.id);
  if (!selected.length) {
    $toast?.error?.("请选择商品");
    return;
  }
  router.push({ path: "/checkout", query: { carts: selected.join(",") } });
}

function refresh() {
  cartStore.fetchCart();
}
</script>

<style scoped>
.bg-page {
  background-color: var(--c-bg);
}
.surface-card,
.bg-surface {
  background-color: var(--c-surface);
}
.text-text {
  color: var(--c-text);
}
.text-muted {
  color: var(--c-muted);
}
.text-primary {
  color: var(--c-primary);
}
.text-primary-on {
  color: var(--c-on-surface);
}

.cart-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  border-radius: 12px;
}
.cart-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(25, 18, 20, 0.06);
}

.checkout-card {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.96),
    var(--c-surface)
  );
  border: 1px solid var(--c-border);
  box-shadow: 0 10px 30px rgba(255, 111, 163, 0.06);
}

/* 带有粉色主色的按钮 */
.btn-primary,
.btn-primary:disabled {
  display: inline-block;
  width: 100%;
  border-radius: 999px;
  font-weight: 600;
  text-align: center;
}

/* 渐变主按钮 */
.btn-primary {
  background: linear-gradient(
    90deg,
    var(--c-primary),
    color-mix(in srgb, var(--c-primary) 75%, #ff5a93 25%)
  );
  color: #fff;
  box-shadow: 0 8px 26px rgba(255, 111, 163, 0.12);
}

/* mobile bar */
.mobile-checkout-bar {
  background: var(--c-surface);
  border-top: 1px solid var(--c-border);
}

/* 数量控制微调 */
.qty-control button {
  background: white;
  border-color: var(--c-border);
}
.qty-control input {
  background: white;
}

/* small utilities */
.hover\:shadow-md:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

/* ---- 新增：布局 & 左侧滚动区域 ---- */

/* 父容器高度保证（留出 header / 顶部间距，按你项目调整） */
.checkout-layout {
  min-height: calc(100vh - 160px); /* 调整这个值以适配你的 header/padding */
}

/* 左侧滚动区域：桌面启用内部滚动 */
.left-scroll {
  max-height: calc(100vh - 220px); /* 留出 header + 页内间距（按需调整） */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
  padding-right: 8px; /* 防止滚动条覆盖内容 */
}

/* 让右侧结算栏 sticky（保留原 top 值） */
.checkout-card {
  position: sticky;
  top: 24px;
}

/* 移动端回退：取消左侧内滚动、sidebar 变为普通流 */
@media (max-width: 1024px) {
  .left-scroll {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
  .checkout-card {
    position: static;
    top: auto;
  }

  /* mobile bottom bar 覆盖时给页面底部一点间距 */
  .min-h-screen {
    padding-bottom: 84px;
  }
}

/* small helpers */
.text-primary-on {
  color: var(--c-on-surface);
}
</style>
