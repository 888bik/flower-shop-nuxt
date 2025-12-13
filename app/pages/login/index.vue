<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0b0b0b] p-6">
    <div class="relative w-[650px] h-[550px]">
      <!-- 背景卡片 -->
      <div
        class="absolute top-[25%] w-full h-[415px] bg-[#1c1c1c] rounded-lg shadow-2xl"
      >
        <!-- 滑动面板 -->
        <div
          class="absolute top-[-10%] left-[5%] w-[320px] h-[500px] bg-[#d4af37] rounded-lg shadow-lg p-6 transition-transform duration-500 ease-in-out z-20"
          :style="{ transform: pinkboxTransform }"
        >
          <!-- 注册表单 -->
          <div v-show="!isLogin">
            <h1
              class="text-black text-3xl font-sans uppercase text-center tracking-widest mb-6"
            >
              Register
            </h1>
            <form
              @submit.prevent="handleRegister"
              class="flex flex-col items-center space-y-2"
            >
              <input
                v-model="signupForm.username"
                type="text"
                placeholder="用户名"
                class="w-[65%] px-3 py-2 bg-[#0b0b0b] text-[#d4af37] border-b border-[#d4af37] focus:outline-none focus:border-[#0b0b0b] placeholder-[#f6f6f6]"
              />
              <p class="text-red-500 text-sm h-5 mt-1">
                {{ signupErrors.username || "\u00A0" }}
              </p>

              <input
                v-model="signupForm.email"
                placeholder="邮箱"
                class="w-[65%] px-3 py-2 bg-[#0b0b0b] text-[#d4af37] border-b border-[#d4af37] focus:outline-none placeholder-[#f6f6f6]"
              />
              <p class="text-red-500 text-sm h-5 mt-1">
                {{ signupErrors.email || "\u00A0" }}
              </p>

              <input
                v-model="signupForm.password"
                type="password"
                placeholder="密码"
                class="w-[65%] px-3 py-2 bg-[#0b0b0b] text-gold border-b border-[#d4af37] focus:outline-none placeholder-[#f6f6f6]"
              />
              <p class="text-red-500 text-sm h-5 mt-1">
                {{ signupErrors.password || "\u00A0" }}
              </p>

              <input
                v-model="signupForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                class="w-[65%] px-3 py-2 bg-[#0b0b0b] text-gold border-b border-[#d4af37] focus:outline-none placeholder-[#f6f6f6]"
              />
              <p class="text-red-500 text-sm h-5 mt-1">
                {{ signupErrors.confirmPassword || "\u00A0" }}
              </p>

              <button
                type="submit"
                class="mt-4 w-[65%] py-2 bg-[#0b0b0b] text-gold border border-gold rounded-lg hover:bg-gold hover:text-[#0b0b0b] transition-colors"
              >
                创建用户
              </button>
            </form>
          </div>

          <!-- 登录表单 -->
          <div v-show="isLogin">
            <h1
              class="text-black text-3xl font-sans uppercase text-center tracking-widest mb-6"
            >
              Sign In
            </h1>
            <form
              @submit.prevent="handleLogin"
              class="flex flex-col items-center space-y-2"
            >
              <input
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名"
                class="w-[65%] px-3 py-2 bg-[#0b0b0b] text-[#d4af37] border-b border-[#d4af37] focus:outline-none placeholder-[#f6f6f6]"
              />
              <p class="text-red-500 text-sm h-5 mt-1">
                {{ loginErrors.username || "\u00A0" }}
              </p>

              <input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="w-[65%] px-3 py-2 bg-[#0b0b0b] text-[#d4af37] border-b border-[#d4af37] focus:outline-none placeholder-[#f6f6f6]"
              />
              <p class="text-red-500 text-sm h-5 mt-1">
                {{ loginErrors.password || "\u00A0" }}
              </p>

              <label class="flex items-center gap-2 text-[#d4af37] text-sm">
                <input
                  type="checkbox"
                  v-model="loginForm.rememberMe"
                  class="w-4 h-4 accent-[#d4af37]"
                />
                <span class="text-white">记住我 </span>
              </label>

              <button
                type="submit"
                class="mt-2 w-[65%] py-2 bg-[#0b0b0b] text-[#d4af37] border border-[#d4af37] rounded-lg hover:bg-[#d4af37] hover:text-[#0b0b0b] transition-colors"
              >
                登录
              </button>
            </form>
          </div>
        </div>

        <!-- 左侧描述 -->
        <div
          class="absolute left-0 top-0 w-1/2 h-full flex flex-col items-center justify-center text-center p-6"
        >
          <h2 class="text-2xl text-[#f6f6f6] font-serif mb-2">
            <span class="text-gold">BLOOM</span>& BOUQUET
          </h2>
          <p class="text-[#f6f6f6]">
            Pick your perfect <span class="text-[#d4af37]">bouquet</span>
          </p>
          <img
            src="https://image.ibb.co/d5X6pn/1357d638624297b.jpg"
            alt="flower"
            class="w-24 h-24 mt-4 opacity-80 rounded"
          />
          <p class="mt-6 text-xs text-[#f6f6f6]">Have an account?</p>
          <button
            @click="showLogin"
            class="mt-2 px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-[#0b0b0b] transition-colors"
            :disabled="isLoading"
          >
            登录
          </button>
        </div>

        <!-- 右侧描述 -->
        <div
          class="absolute right-0 top-0 w-1/2 h-full flex flex-col items-center justify-center text-center p-6"
        >
          <h2 class="text-2xl text-[#f6f6f6] font-serif mb-2">
            <span class="text-gold">BLOOM</span>& BOUQUET
          </h2>
          <p class="text-[#f6f6f6]">
            Pick your perfect <span class="text-[#d4af37]">bouquet</span>
          </p>
          <img
            src="https://preview.ibb.co/jvu2Un/0057c1c1bab51a0.jpg"
            alt="flower"
            class="w-28 h-28 mt-4 opacity-80 rounded"
          />
          <p class="mt-6 text-xs text-[#f6f6f6]">Don't have an account?</p>
          <button
            @click="showSignup"
            class="mt-2 px-4 py-2 border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37] hover:text-[#0b0b0b] transition-colors"
          >
            注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

definePageMeta({ layout: "empty" });
const { $api } = useNuxtApp();

const {
  signupForm,
  loginForm,
  signupErrors,
  loginErrors,
  validateSignup,
  validateLogin,
} = useAuthForm();

const isLogin = ref(true);
const router = useRouter();
const isLoading = ref(false);

function showLogin() {
  isLogin.value = true;
}
function showSignup() {
  isLogin.value = false;
}

const handleRegister = async () => {
  if (!validateSignup()) return;

  try {
    const token = await $api.user.userRegister(signupForm);

    if (token) {
      setToken(token, false, "user-token");

      $toast.success("登录成功 🎉");

      router.push("/");
    }
  } catch (error: any) {
    $toast.error(error?.message || "登录失败，请检查账号密码");
  }
};
const handleLogin = async () => {
  if (!validateLogin()) return;

  try {
    const { token } = await $api.user.userLogin(
      loginForm.username,
      loginForm.password
    );
    if (loginForm.rememberMe) {
      // 勾选“记住我”，保存长期 cookie
      setToken(token, true, "user-token");
    } else {
      // 未勾选，浏览器关闭就失效
      setToken("user-token");
    }

    $toast.success("登录成功 🎉");
    router.push("/");
  } catch (error: any) {
    $toast.error(error?.message || "登录失败，请检查账号密码");
  }
};

const pinkboxTransform = computed(() =>
  isLogin.value ? "translateX(0%)" : "translateX(80%)"
);
</script>

<style scoped></style>
