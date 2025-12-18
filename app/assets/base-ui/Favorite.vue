<template>
  <div class="like-button">
    <input
      class="on"
      :id="inputId"
      type="checkbox"
      v-model="checked"
      :disabled="working"
    />
    <label class="like" :for="inputId">
      <svg
        class="like-icon"
        fill-rule="nonzero"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
        ></path>
      </svg>
      <span class="like-text">{{
        goodsFavorite.isFavorite.value ? "已收藏" : "收藏"
      }}</span>
    </label>
    <span class="like-count one">{{ goodsFavorite.likeCount.value }}</span>
    <span class="like-count two">{{ goodsFavorite.likeCount.value }}</span>
  </div>
</template>
<script setup lang="ts">
interface IEmits {
  (e: "require-login"): void;
  (e: "toggled", payload: { isFavorite: boolean; likeCount: number }): void;
}
const emit = defineEmits<IEmits>();

const authStore = useAuthStore();

const { $api } = useNuxtApp();

const goodsFavorite = inject<{
  goodsId: Ref<number>;
  likeCount: Ref<number>;
  isFavorite: Ref<boolean>;
}>("goodsFavorite")!;

// 唯一 id，避免页面上多个 heart 冲突
const inputId = computed(
  () =>
    `heart-${
      goodsFavorite.goodsId.value ?? Math.random().toString(36).slice(2, 8)
    }`
);

// 防并发开关
const working = ref(false);

const checked = computed<boolean>({
  get() {
    return !!goodsFavorite.isFavorite.value;
  },
  async set(next: boolean) {
    // 如果已经在处理，直接恢复到当前值（阻止重复）
    if (working.value) {
      // 不改变 UI（v-model 会把 checkbox 值先改回去，这里把它改回为真实值）
      // 直接返回，模板会显示真实值
      goodsFavorite.isFavorite.value = !!goodsFavorite.isFavorite.value;
      return;
    }

    const prevFav = goodsFavorite.isFavorite.value;
    const prevCount = goodsFavorite.likeCount.value;

    // 未登录：不要切换状态，触发父组件弹窗
    if (!authStore.isLogin) {
      // 强制恢复到老值（因为 v-model 已经把 checkbox 改了）
      goodsFavorite.isFavorite.value = prevFav;
      // 通过 emit 让父组件处理登录弹窗
      emit("require-login");
      // no state change
      return;
    }

    working.value = true;

    // 乐观更新
    goodsFavorite.isFavorite.value = next;
    goodsFavorite.likeCount.value = next
      ? prevCount + 1
      : Math.max(0, prevCount - 1);

    try {
      const res = await $api.user.toggleGoodsFavorite(
        goodsFavorite.goodsId.value,
        next
      );
      // 如果后端返回最新计数，使用后端值（兼容性）
      if (res && typeof res.likeCount === "number") {
        goodsFavorite.likeCount.value = res.likeCount;
      }
      // 通知父组件（如果需要同步其它地方）
      emit("toggled", {
        isFavorite: goodsFavorite.isFavorite.value,
        likeCount: goodsFavorite.likeCount.value,
      });
    } catch (err) {
      // 回滚
      goodsFavorite.isFavorite.value = prevFav;
      goodsFavorite.likeCount.value = prevCount;
      // 如果是 401，也 emit 登录事件以便父组件弹窗
      // const status = err?.response?.status || err?.status;
      // if (status === 401) {
      //   emits("require-login");
      // } else {
      //   $toast?.error?.(err?.message || "操作失败，请重试");
      // }
    } finally {
      working.value = false;
    }
  },
});
</script>
<style scoped>
.on {
  display: none;
}

.like-button {
  position: relative;
  cursor: pointer;
  display: flex;
  height: 48px;
  width: 136px;
  border-radius: 16px;
  border: none;
  background-color: #fff;
  overflow: hidden;
  box-shadow: inset -2px -2px 5px rgba(255, 255, 255, 0.2),
    inset 2px 2px 5px rgba(0, 0, 0, 0.1), 4px 4px 10px rgba(0, 0, 0, 0.4),
    -2px -2px 8px rgba(255, 255, 255, 0.1);
}

.like {
  width: 70%;
  height: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-evenly;
}

.like-icon {
  fill: #505050;
  height: 28px;
  width: 28px;
}

.like-text {
  color: #333;
  font-size: 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.like-count {
  position: absolute;
  right: 0;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #717070;
  font-size: 16px;
  border-left: 2px solid #4e4e4e;
  transition: all 0.5s ease-out;
}

.like-count.two {
  transform: translateY(40px);
}

.on:checked ~ .like .like-icon {
  fill: #fc4e4e;
  animation: enlarge 0.2s ease-out 1;
  transition: all 0.2s ease-out;
}

.on:checked ~ .like-count.two {
  transform: translateX(0);
  color: #717070;
}

.on:checked ~ .like-count.one {
  transform: translateY(-40px);
}

.on:disabled + .like {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes enlarge {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1.2);
  }
}
</style>
