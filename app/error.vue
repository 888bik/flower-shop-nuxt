<template>
  <div
    class="flex justify-center items-center h-screen overflow-hidden bg-black"
  >
    <div
      class="max-w-[800px] flex flex-col justify-center items-center gap-3 mx-3 text-white"
    >
      <!-- 错误代码 -->
      <div
        class="w-full mx-auto text-[6rem] font-extrabold flex justify-center items-center gap-2"
      >
        <p class="animate-fall rotate-[-20deg] my-[50px]">4</p>
        <p class="text-[#d4af37] opacity-0 animate-bounce">0</p>
        <p class="animate-fall2 rotate-[8deg] my-[50px]">4</p>
      </div>

      <!-- 标题 -->
      <div class="text-[1.5rem] font-bold text-center w-[300px]">
        Page Not Found
      </div>

      <!-- 描述 -->
      <div
        class="text-sm text-justify leading-relaxed px-5 md:px-0 text-[#959695]"
      ></div>

      <!-- 返回按钮 -->
      <button
        @click="goHome"
        class="px-6 py-2 rounded-full bg-[#d4af37] text-[#f2f5f5] hover:opacity-80 transition"
      >
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
/*  fall 动画 */
@keyframes fall {
  0% {
    transform: translateY(-100vh);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fall2 {
  0% {
    transform: translateY(-100vh);
  }
  100% {
    transform: translateY(0);
  }
}

/*  bounce 动画 */
@keyframes bounce {
  0%,
  40%,
  75%,
  95% {
    transform: translateY(0);
    opacity: 1;
  }
  15% {
    transform: translateY(-25px);
  }
  65% {
    transform: translateY(-15px);
  }
  85% {
    transform: translateY(-5px);
  }
  100% {
    transform: rotateZ(45deg);
    opacity: 1;
  }
}

/* 应用动画 */
.animate-fall {
  animation: fall 1s linear forwards;
}

.animate-fall2 {
  animation: fall 1.8s linear forwards;
}

.animate-bounce {
  animation: bounce 1.2s 1.8s linear forwards;
}
</style>
