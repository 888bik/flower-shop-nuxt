<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <!-- 顶部卡片 -->
    <div
      class="rounded-2xl overflow-hidden bg-[#070707] border border-white/6 shadow-soft-lg"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-center">
        <!-- Avatar + basic -->
        <div class="flex items-center gap-4">
          <div
            class="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[#111] to-[#0b0b0b] flex items-center justify-center border border-white/6"
          >
            <img
              v-if="profile.user?.avatar"
              :src="profile.user.avatar"
              :alt="displayName"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="text-2xl font-semibold text-white/80">
              {{ initials }}
            </div>
          </div>

          <div>
            <div class="text-xl md:text-2xl font-semibold text-white">
              {{ displayName }}
            </div>
            <div class="text-sm text-white/60 mt-1">
              <span class="inline-block mr-3"
                >角色：<span class="font-medium text-white">{{
                  profile.user?.role ?? "user"
                }}</span></span
              >
              <span v-if="profile.info?.name" class="inline-block"
                >真实名：{{ profile.info.name }}</span
              >
            </div>
            <div class="mt-3 flex gap-2">
              <button
                @click="goToEdit"
                class="px-3 py-2 rounded-md bg-[#d4af37] text-black font-medium"
              >
                编辑资料
              </button>
              <button
                @click="goToOrders"
                class="px-3 py-2 rounded-md border border-white/8 text-white/90"
              >
                我的订单
              </button>
            </div>
          </div>
        </div>

        <!-- 关键统计 -->
        <div class="md:col-span-2 grid grid-cols-3 gap-4">
          <div
            class="p-4 rounded-lg bg-[#0c0c0c] border border-white/6 flex flex-col"
          >
            <div class="text-xs text-white/60">订单总额</div>
            <div class="mt-2 text-lg font-semibold text-[#d4af37]">
              ¥{{ formatMoney(profile.stats.orderPrice) }}
            </div>
          </div>

          <div
            class="p-4 rounded-lg bg-[#0c0c0c] border border-white/6 flex flex-col"
          >
            <div class="text-xs text-white/60">累计佣金</div>
            <div class="mt-2 text-lg font-semibold text-[#d4af37]">
              ¥{{ formatMoney(profile.stats.commission) }}
            </div>
          </div>

          <div
            class="p-4 rounded-lg bg-[#0c0c0c] border border-white/6 flex flex-col"
          >
            <div class="text-xs text-white/60">可提现</div>
            <div class="mt-2 text-lg font-semibold text-[#d4af37]">
              ¥{{
                formatMoney(
                  profile.stats.noCashOutPrice ?? profile.stats.cashOutPrice
                )
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- 操作入口 & 简要统计 -->
      <div
        class="border-t border-white/6 p-4 flex items-center justify-between"
      >
        <div class="flex gap-4">
          <button
            @click="goToAddresses"
            class="px-3 py-2 rounded-md bg-transparent border border-white/8 text-white/90"
          >
            地址管理 ({{ profile.addresses?.length ?? 0 }})
          </button>
          <button
            @click="goToBills"
            class="px-3 py-2 rounded-md bg-transparent border border-white/8 text-white/90"
          >
            账单 ({{ profile.bills?.length ?? 0 }})
          </button>
          <button
            @click="withdraw"
            class="px-3 py-2 rounded-md bg-[#d4af37] text-black"
          >
            我要提现
          </button>
        </div>

        <div class="text-sm text-white/60">
          上次登录：<span class="text-white">{{}}</span>
        </div>
      </div>
    </div>

    <!-- 最近账单 & 地址卡 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <!-- 最近账单 -->
      <div
        class="md:col-span-2 bg-[#070707] border border-white/6 rounded-xl p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-semibold text-white">最近分佣账单</div>
          <NuxtLink
            to="/profile/bills"
            class="text-sm text-white/60 hover:text-[#d4af37]"
            >查看全部 →</NuxtLink
          >
        </div>

        <div v-if="profile.bills && profile.bills.length">
          <ul class="space-y-3">
            <li
              v-for="b in profile.bills.slice(0, 6)"
              :key="b.id"
              class="p-3 rounded-md bg-[#0b0b0b] border border-white/4 flex justify-between items-center"
            >
              <div>
                <div class="text-sm text-white">{{ billTitle(b) }}</div>
                <div class="text-xs text-white/60 mt-1">
                  状态：{{ billStatusText(b.status) }} · 订单 #{{
                    b.orderId ?? "-"
                  }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-[#d4af37]">
                  +¥{{ formatMoney(b.commission) }}
                </div>
                <div class="text-xs text-white/60 mt-1">
                  {{ timeAgo(b.createTime) }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="text-sm text-white/60">暂无分佣账单</div>
      </div>

      <!-- 地址简要 -->
      <div class="bg-[#070707] border border-white/6 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-semibold text-white">常用地址</div>
          <NuxtLink
            to="/profile/addresses"
            class="text-sm text-white/60 hover:text-[#d4af37]"
            >管理</NuxtLink
          >
        </div>

        <div v-if="profile.addresses && profile.addresses.length">
          <ul class="space-y-2">
            <li
              v-for="a in profile.addresses.slice(0, 3)"
              :key="a.id"
              class="text-sm text-white/80"
            >
              <div class="font-medium">{{ a.name }} · {{ a.phone }}</div>
              <div class="text-xs text-white/60">
                {{ a.province }} {{ a.city }} {{ a.district }} {{ a.address }}
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="text-sm text-white/60">暂无地址，请前往添加</div>
      </div>
    </div>

    <!-- Footer actions -->
    <div class="mt-6 flex justify-end gap-3">
      <button
        @click="logout"
        class="px-4 py-2 rounded-md bg-transparent border border-white/6 text-white/90"
      >
        退出登录
      </button>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="mt-6 text-center text-white/60">加载中…</div>
    <div v-if="error" class="mt-6 text-center text-rose-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { UserProfile } from "~/types/api/user";
definePageMeta({ layout: "profile" });

const router = useRouter();
const userStore = useUserStore();
const profile = ref<UserProfile>({
  user: null,
  info: null,
  addresses: [],
  bills: [],
  stats: {
    orderPrice: "0.00",
    commission: "0.00",
    noCashOutPrice: "0.00",
    cashOutPrice: "0.00",
    shareNum: 0,
    shareOrderNum: 0,
  },
  level: null,
});
const loading = ref(false);
const error = ref<string | null>(null);

// 辅助显示文本
const displayName = computed(
  () => profile.value.user?.nickname || profile.value.user?.username || "用户"
);

const initials = computed(() => {
  const n = displayName.value;
  return n ? n.slice(0, 1).toUpperCase() : "U";
});

// const lastLoginText = computed(() => {
//   const t = profile.value.user?.lastLoginTime;
//   if (!t) return "—";
//   const d = new Date(t * 1000);
//   return d.toLocaleString();
// });

function formatMoney(v: any) {
  if (v == null) return "0.00";
  const n = Number(v);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2);
}

function billTitle(b: any) {
  // 简单标题：佣金来源说明（可根据业务改）
  return `分佣 ${b.level === 1 ? "一级" : b.level === 2 ? "二级" : ""}`;
}

function billStatusText(s: any) {
  if (s === 1) return "生效";
  if (s === 0) return "冻结";
  if (s === -1) return "失效";
  return String(s);
}

function timeAgo(ts: number | undefined) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - ts * 1000) / 1000);
  if (diff < 60) return `${diff}s 前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m 前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h 前`;
  return `${Math.floor(diff / 86400)}d 前`;
}

// 跳转 helpers
function goToEdit() {
  router.push("/profile/edit");
}
function goToOrders() {
  router.push("/order");
}
function goToAddresses() {
  router.push("/profile/addresses");
}
function goToBills() {
  router.push("/profile/bills");
}
function withdraw() {
  router.push("/profile/withdraw");
}

// 登出（示例：清空本地 token 并跳转登录）
function logout() {
  // 如果你有后端登出接口，可在此调用
  removeToken("user-token");
  router.push("/login");
}
// 页面挂载时同步一次
onMounted(() => {
  if (userStore.userInfo) {
    profile.value = { ...profile.value, ...userStore.userInfo };
  }
});

// 或者用 watchEffect 自动响应变化
watchEffect(() => {
  if (userStore.userInfo) {
    profile.value = { ...profile.value, ...userStore.userInfo };
  }
});
</script>

<style scoped>
/* small shadow from earlier */
.shadow-soft-lg {
  box-shadow: 0 8px 30px rgba(15, 23, 36, 0.12);
}

/* 微调：确保卡片在黑底上有分隔线 */
.border-white\/6 {
  border-color: rgba(255, 255, 255, 0.06);
}

/* 保持细节一致 */
.text-white\/60 {
  color: rgba(255, 255, 255, 0.6);
}
</style>
