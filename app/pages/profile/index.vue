<template>
  <div class="max-w-5xl mx-auto px-6 py-10 theme-pink">
    <!-- 顶部卡片 -->
    <div
      class="rounded-2xl overflow-hidden bg-surface border border-borderColor shadow-soft-lg"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-center">
        <div class="flex items-center gap-4">
          <div
            class="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[rgba(0,0,0,0.04)] to-[rgba(0,0,0,0.02)] flex items-center justify-center border"
            :style="{ borderColor: 'var(--c-border)' }"
          >
            <img
              :src="avatarSrc"
              :alt="displayName"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              v-if="!mounted || !profile.user?.avatar"
              class="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-onSurface"
              aria-hidden="true"
            >
              {{ initials }}
            </div>
          </div>

          <div>
            <div class="text-xl md:text-2xl font-semibold text-text">
              {{ displayName }}
            </div>
            <div class="text-sm text-muted mt-1">
              <span class="inline-block mr-3"
                >会员：<span class="font-medium text-text">{{
                  profile.level?.name ?? "青铜会员"
                }}</span></span
              >
              <span v-if="mounted && profile.info?.name" class="inline-block"
                >真实名：{{ profile.info.name }}</span
              >
            </div>
            <div class="mt-3 flex gap-2">
              <button
                @click="goToEdit"
                class="px-3 py-2 rounded-md bg-primary text-white font-medium"
              >
                编辑资料
              </button>
              <button
                @click="goToOrders"
                class="px-3 py-2 rounded-md border"
                :style="{
                  borderColor: 'var(--c-border)',
                  color: 'var(--c-text)',
                }"
              >
                我的订单
              </button>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 grid grid-cols-2 gap-4">
          <div
            class="p-4 rounded-lg bg-page border flex flex-col"
            :style="{ borderColor: 'var(--c-border)' }"
          >
            <div class="text-xs text-muted">订单总额</div>
            <div class="mt-2 text-lg font-semibold text-accent">
              ¥{{ formatMoney(profile.stats.orderPrice) }}
            </div>
          </div>

          <div
            class="p-4 rounded-lg bg-page border flex flex-col"
            :style="{ borderColor: 'var(--c-border)' }"
          >
            <div class="text-xs text-muted">分享订单数</div>
            <div class="mt-2 text-lg font-semibold text-accent">
              {{ profile.stats.shareOrderNum ?? 0 }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="border-t p-4 flex items-center justify-between"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <div class="flex gap-4">
          <button
            @click="goToAddresses"
            class="px-3 py-2 rounded-md bg-transparent border"
            :style="{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }"
          >
            地址管理 ({{ profile.addresses?.length ?? 0 }})
          </button>
          <button
            @click="goToBills"
            class="px-3 py-2 rounded-md bg-transparent border"
            :style="{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }"
          >
            账单 ({{ profile.bills?.length ?? 0 }})
          </button>
        </div>

        <div class="text-sm text-muted">
          上次登录：<span class="text-text">{{ lastLoginText }}</span>
        </div>
      </div>
    </div>

    <!-- 最近账单 & 地址卡 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <!-- 最近账单 -->
      <div
        class="md:col-span-2 bg-surface border rounded-xl p-4"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-semibold text-text">最近分佣账单</div>
          <NuxtLink
            to="/profile/bills"
            class="text-sm text-muted hover:text-primary"
            >查看全部 →</NuxtLink
          >
        </div>

        <div v-if="mounted && profile.bills && profile.bills.length">
          <ul class="space-y-3">
            <li
              v-for="b in profile.bills.slice(0, 6)"
              :key="b.id"
              class="p-3 rounded-md bg-page border flex justify-between items-center"
              :style="{ borderColor: 'rgba(0,0,0,0.02)' }"
            >
              <div>
                <div class="text-sm text-text">{{ billTitle(b) }}</div>
                <div class="text-xs text-muted mt-1">
                  状态：{{ billStatusText(b.status) }} · 订单 #{{
                    b.orderId ?? "-"
                  }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-accent">
                  +¥{{ formatMoney(b.commission) }}
                </div>
                <div class="text-xs text-muted mt-1">
                  {{ timeAgo(b.createTime) }}
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div v-else class="text-sm text-muted">暂无分佣账单</div>
      </div>

      <!-- 地址简要 -->
      <div
        class="bg-surface border rounded-xl p-4"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-lg font-semibold text-text">常用地址</div>
          <NuxtLink
            to="/profile/addresses"
            class="text-sm text-muted hover:text-primary"
            >管理</NuxtLink
          >
        </div>

        <div v-if="mounted && profile.addresses && profile.addresses.length">
          <ul class="space-y-2">
            <li
              v-for="a in profile.addresses.slice(0, 3)"
              :key="a.id"
              class="text-sm text-text"
            >
              <div class="font-medium">{{ a.name }} · {{ a.phone }}</div>
              <div class="text-xs text-muted">
                {{ a.province }} {{ a.city }} {{ a.district }} {{ a.address }}
              </div>
            </li>
          </ul>
        </div>

        <div v-else class="text-sm text-muted">暂无地址，请前往添加</div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <button
        @click="authStore.logout"
        class="px-4 py-2 rounded-md bg-transparent border"
        :style="{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }"
      >
        退出登录
      </button>
    </div>

    <div v-if="loading" class="mt-6 text-center text-muted">加载中…</div>
    <div v-if="error" class="mt-6 text-center text-rose-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts" client>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import type { UserProfile } from "~/types/api/user";

definePageMeta({ layout: "profile" });

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

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

const mounted = ref(false);

const avatarSrc = computed(() => {
  if (!mounted.value) return "/default-avatar.svg";
  return userStore.userInfo?.user?.avatar || "/default-avatar.svg";
});

const displayName = computed(() => {
  if (!mounted.value) return "用户";
  return profile.value.user?.nickname || profile.value.user?.username || "用户";
});

const initials = computed(() => {
  const n = displayName.value;
  return n ? n.slice(0, 1).toUpperCase() : "U";
});

const lastLoginText = computed(() => {
  if (!mounted.value) return "—";
  const t = profile.value.user?.lastLoginTime;
  if (!t) return "—";
  return new Date(t * 1000).toLocaleString();
});

function formatMoney(v: any) {
  if (v == null) return "0.00";
  const n = Number(v);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2);
}

function billTitle(b: any) {
  return `分佣 ${b.level === 1 ? "一级" : b.level === 2 ? "二级" : ""}`;
}

function billStatusText(s: any) {
  if (s === 1) return "生效";
  if (s === 0) return "冻结";
  if (s === -1) return "失效";
  return String(s);
}

function timeAgo(ts: number | undefined) {
  if (!ts || !mounted.value) return "—";
  const diff = Math.floor((Date.now() - ts * 1000) / 1000);
  if (diff < 60) return `${diff}s 前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m 前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h 前`;
  return `${Math.floor(diff / 86400)}d 前`;
}

function goToEdit() {
  router.push("/profile/edit");
}
function goToOrders() {
  router.push("/orders");
}
function goToAddresses() {
  router.push("/profile/addresses");
}
function goToBills() {
  router.push("/profile/bills");
}

onMounted(() => {
  mounted.value = true;
  if (userStore.userInfo) {
    profile.value = { ...profile.value, ...userStore.userInfo };
  }
});

watch(
  () => userStore.userInfo,
  (v) => {
    if (!mounted.value) return;
    if (v) profile.value = { ...profile.value, ...v };
  }
);
</script>
<style scoped>
.shadow-soft-lg {
  box-shadow: 0 8px 30px rgba(15, 23, 36, 0.06);
}

.w-28.h-28 {
  position: relative;
}
.w-28.h-28 .absolute {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
