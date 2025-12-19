<template>
  <v-dialog v-model="dialogVisible" max-width="640" persistent>
    <v-card class="rounded-lg">
      <v-toolbar flat class="px-4">
        <v-toolbar-title class="font-bold">物流信息</v-toolbar-title>
        <v-spacer />
        <v-btn
          icon
          small
          @click="copyTracking"
          v-if="shipData?.trackingNo"
          :title="'复制运单号: ' + shipData.trackingNo"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <v-btn icon small @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <div v-if="loading" class="py-8 flex justify-center">
          <ThreeBodyLoader />
        </div>

        <div v-else-if="!shipData" class="py-8 text-center text-muted">
          暂无物流信息
        </div>

        <div v-else>
          <!-- header info -->
          <div class="mb-4 info-card">
            <div class="info-row">
              <div class="label">快递公司</div>
              <div class="value">{{ shipData.company.name }}</div>
            </div>
            <div class="info-row">
              <div class="label">配送方式</div>
              <div class="value">
                {{ shipData.shipping.name }}（¥{{ shipData.shipping.fee }}）
              </div>
            </div>
            <div class="info-row">
              <div class="label">运单号</div>
              <div class="value tracking">
                {{ shipData.trackingNo }}
                <v-chip
                  small
                  class="ml-2"
                  color="grey lighten-3"
                  text-color="black"
                  @click="copyTracking"
                  style="cursor: pointer"
                >
                  复制
                </v-chip>
              </div>
            </div>
          </div>

          <!-- timeline -->
          <div class="timeline-wrap">
            <div class="timeline-line" aria-hidden></div>

            <div
              v-for="(item, index) in sortedHistory"
              :key="index"
              class="timeline-item"
              :class="{ 'is-first': index === 0 }"
            >
              <div
                class="timeline-dot-wrapper"
                :style="{ zIndex: sortedHistory.length - index }"
              >
                <div
                  class="timeline-dot"
                  :class="dotClass(item.status, index)"
                  :title="statusLabel(item.status)"
                >
                  <v-icon v-if="index === 0" size="18">{{
                    statusIcon(item.status)
                  }}</v-icon>
                </div>
              </div>

              <div class="timeline-card">
                <div class="card-head">
                  <div class="status-label">
                    {{ statusLabel(item.status) }}
                  </div>
                  <div class="time-text">{{ formatTime(item.time) }}</div>
                </div>

                <div class="card-body">
                  <div class="desc">{{ item.desc }}</div>
                  <div class="location">{{ item.location }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="close">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";

const { $api } = useNuxtApp();

const dialogVisible = ref(false);
const loading = ref(false);
const shipData = ref<any | null>(null);

const open = async (orderId: number) => {
  loading.value = true;
  shipData.value = null;
  try {
    const res = await $api.orders.getShipData(orderId);
    shipData.value = res ?? null;
    dialogVisible.value = true;
  } catch (err) {
    shipData.value = null;
    console.error("load ship data error", err);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  dialogVisible.value = false;
};

function copyTracking() {
  if (!shipData.value?.trackingNo) return;
  const txt = shipData.value.trackingNo;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(txt);

    $toast.success?.("已复制运单号");
  } else {
    const ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

// 时间倒序
const sortedHistory = computed(() => {
  if (!shipData.value?.history) return [];
  return [...shipData.value.history].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
});

const statusMap: Record<string, string> = {
  PICKED: "已揽收",
  DEPARTED: "已离开",
  ARRIVED: "已到达",
  OUT_FOR_DELIVERY: "派送中",
  IN_STORAGE: "已暂存",
  SIGNED: "已签收",
};

function statusLabel(s: string) {
  return statusMap[s] ?? s;
}

function statusIcon(s: string) {
  if (s === "SIGNED") return "mdi-checkbox-marked-circle";
  if (s === "OUT_FOR_DELIVERY" || s === "IN_STORAGE") return "mdi-truck-fast";
  if (s === "PICKED") return "mdi-handshake";
  return "mdi-map-marker";
}

function dotClass(status: string, index: number) {
  if (index === 0) return "dot-current";
  switch (status) {
    case "SIGNED":
      return "dot-signed";
    case "OUT_FOR_DELIVERY":
    case "IN_STORAGE":
      return "dot-delivering";
    case "PICKED":
    case "DEPARTED":
    case "ARRIVED":
      return "dot-muted";
    default:
      return "dot-default";
  }
}

function formatTime(t: string) {
  const d = new Date(t);
  if (isNaN(d.getTime())) return t;
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${Y}-${M}-${D} ${hh}:${mm}`;
}

defineExpose({ open });
</script>

<style scoped>
/* overall */
.info-card {
  border-radius: 8px;
  padding: 12px;
  background: linear-gradient(180deg, #fff, #fff);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 8px;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.04);
}
.info-row:last-child {
  border-bottom: none;
}
.label {
  color: #666;
  font-size: 13px;
}
.value {
  color: #111;
  font-weight: 600;
  font-size: 14px;
}

/* timeline layout */
.timeline-wrap {
  position: relative;
  padding-left: 36px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.timeline-line {
  position: absolute;
  left: 9px;
  top: 18px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgba(236, 79, 154, 0.15),
    rgba(0, 0, 0, 0.06)
  );
  border-radius: 2px;
}

/* each item */
.timeline-item {
  position: relative;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
}
.timeline-dot-wrapper {
  width: 36px;
  display: flex;
  justify-content: center;
}
.timeline-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #9e9e9e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
/* current (latest) */
.dot-current {
  width: 28px;
  height: 28px;
  background: linear-gradient(90deg, #ff6ea1, #ec407a);
  box-shadow: 0 8px 26px rgba(236, 79, 154, 0.18);
  animation: pulse 1.6s infinite;
  font-size: 14px;
}
@keyframes pulse {
  0% {
    box-shadow: 0 8px 26px rgba(236, 79, 154, 0.18);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 18px 42px rgba(236, 79, 154, 0.12);
    transform: scale(1.03);
  }
  100% {
    box-shadow: 0 8px 26px rgba(236, 79, 154, 0.18);
    transform: scale(1);
  }
}

/* colored dots */
.dot-signed {
  background: linear-gradient(90deg, #66bb6a, #43a047);
}
.dot-delivering {
  background: linear-gradient(90deg, #ff6ea1, #ec407a);
}
.dot-muted {
  background: #bdbdbd;
}
.dot-default {
  background: #42a5f5;
}

/* content card */
.timeline-card {
  flex: 1;
  margin-left: 6px;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.status-label {
  font-weight: 700;
  color: #333;
  font-size: 14px;
}
.time-text {
  color: #9e9e9e;
  font-size: 12px;
}
.card-body {
  background: #fff;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.03);
}
.desc {
  font-size: 14px;
  color: #222;
  margin-bottom: 6px;
}
.location {
  font-size: 12px;
  color: #888;
}

/* small adjustments */
.text-muted {
  color: #9e9e9e;
}
.tracking {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
