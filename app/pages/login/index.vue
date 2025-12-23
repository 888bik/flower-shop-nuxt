<template>
  <div class="container">
    <div class="welcome">
      <!-- 将滑动面板 transform 绑定到计算属性，保持原样式 -->
      <div class="pinkbox" :style="{ transform: pinkboxTransform }">
        <!-- 注册表单 -->
        <div class="signup" v-show="!isLogin">
          <h1>register</h1>
          <form autocomplete="off" @submit.prevent="handleRegister">
            <input
              v-model="signupForm.username"
              type="text"
              placeholder="用户名"
            />
            <p class="text-red-500 text-sm h-5 mt-1">
              {{ signupErrors.username || "\u00A0" }}
            </p>

            <input
              v-model="signupForm.email"
              type="email"
              placeholder="邮箱"
            />
            <p class="text-red-500 text-sm h-5 mt-1">
              {{ signupErrors.email || "\u00A0" }}
            </p>

            <input
              v-model="signupForm.password"
              type="password"
              placeholder="密码"
            />
            <p class="text-red-500 text-sm h-5 mt-1">
              {{ signupErrors.password || "\u00A0" }}
            </p>

            <input
              v-model="signupForm.confirmPassword"
              type="password"
              placeholder="确认密码"
            />
            <p class="text-red-500 text-sm h-5 mt-1">
              {{ signupErrors.confirmPassword || "\u00A0" }}
            </p>

            <button class="button submit" type="submit" :disabled="isLoading">
              创建用户
            </button>
          </form>
        </div>

        <!-- 登录表单 -->
        <div class="signin" v-show="isLogin">
          <h1>sign in</h1>
          <form
            class="more-padding"
            autocomplete="off"
            @submit.prevent="handleLogin"
          >
            <input
              v-model="loginForm.username"
              type="text"
              placeholder="用户名"
            />
            <p class="text-red-500 text-sm h-5 mt-1">
              {{ loginErrors.username || "\u00A0" }}
            </p>

            <input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
            />
            <p class="text-red-500 text-sm h-5 mt-1">
              {{ loginErrors.password || "\u00A0" }}
            </p>

            <div class="checkbox">
              <label class="check-wrap">
                <input
                  id="remember"
                  type="checkbox"
                  v-model="loginForm.rememberMe"
                />
                <span class="check-box"></span>
                <div class="check-text text-[#a76871]!">remember me</div>
              </label>
            </div>

            <button class="button submit" type="submit" :disabled="isLoading">
              登录
            </button>
          </form>
        </div>
      </div>

      <div class="leftbox">
        <h2 class="title"><span>BLOOM</span>&<br />BOUQUET</h2>
        <p class="desc">pick your perfect <span>bouquet</span></p>
        <img
          class="flower smaller"
          src="https://image.ibb.co/d5X6pn/1357d638624297b.jpg"
          alt="1357d638624297b"
          border="0"
        />
        <p class="account">没有账号?</p>
        <button class="button" @click="showLogin" :disabled="isLoading">
          登录
        </button>
      </div>

      <div class="rightbox">
        <h2 class="title"><span>BLOOM</span>&<br />BOUQUET</h2>
        <p class="desc">pick your perfect <span>bouquet</span></p>
        <img
          class="flower"
          src="https://preview.ibb.co/jvu2Un/0057c1c1bab51a0.jpg"
        />
        <p class="account">没有账户?</p>
        <button class="button" @click="showSignup">注册</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "empty",
});

const { $api } = useNuxtApp();

const userStore = useUserStore();
const authStore = useAuthStore();

const {
  signupForm,
  loginForm,
  signupErrors,
  loginErrors,
  validateSignup,
  validateLogin,
} = useAuthForm();

// 组件内部状态
const isLogin = ref(true);
const isLoading = ref(false);
const router = typeof useRouter === "function" ? useRouter() : (null as any);
const route = typeof useRoute === "function" ? useRoute() : (null as any);

const redirect = computed(() => {
  try {
    return (route?.query?.redirect as string) || "/";
  } catch {
    return "/";
  }
});

function showLogin() {
  isLogin.value = true;
}
function showSignup() {
  isLogin.value = false;
}

// 注册
const handleRegister = async () => {
  if (typeof validateSignup === "function" && !validateSignup()) return;
  isLoading.value = true;
  try {
    const tokens = await $api.user?.userRegister?.(signupForm);
    if (tokens) {
      authStore?.login?.(tokens, true);
      $toast?.success?.("注册成功，正在跳转");
      await userStore?.fetchUserInfo?.();
      router?.replace?.(redirect.value);
    } else {
      throw new Error("register failed");
    }
  } catch (error: any) {
    $toast?.error?.("注册失败，请稍后尝试");
  } finally {
    isLoading.value = false;
  }
};

// 登录
const handleLogin = async () => {
  if (typeof validateLogin === "function" && !validateLogin()) return;
  isLoading.value = true;
  try {
    const tokens = await $api.user?.userLogin?.(
      loginForm.username,
      loginForm.password
    );
    if (!tokens) throw new Error("login failed");
    authStore?.login?.(tokens, loginForm.rememberMe);
    $toast?.success?.("登录成功");
    await userStore?.fetchUserInfo?.();
    router?.replace?.(redirect.value);
  } catch (error: any) {
    $toast?.error?.("登录失败，请检查账号或者密码是否正确");
  } finally {
    isLoading.value = false;
  }
};

const pinkboxTransform = computed(() =>
  isLogin.value ? "translateX(0%)" : "translateX(80%)"
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400|Lora");

/* 全局背景 */
body {
  background: #cbc0d3 !important;
}

/* 容器 */
.container {
  margin: auto;
  width: 650px;
  height: 550px;
  position: relative;
}

.welcome {
  background: #f6f6f6;
  width: 650px;
  height: 415px;
  position: absolute;
  top: 25%;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
}

.pinkbox {
  position: absolute;
  top: -10%;
  left: 5%;
  background: #eac7cc;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease-in-out;
  z-index: 2;
}

.nodisplay {
  display: none;
}

.leftbox,
.rightbox {
  position: absolute;
  width: 50%;
  transition: 1s all ease;
}

.leftbox {
  left: -2%;
}

.rightbox {
  right: -2%;
}

/* 字体 */
h1 {
  font-family: "Open Sans", sans-serif;
  text-align: center;
  margin-top: 95px;
  text-transform: uppercase;
  color: #f6f6f6;
  font-size: 2em;
  letter-spacing: 8px;
}

.title {
  font-family: "Lora", serif;
  color: #8e9aaf;
  font-size: 1.8em;
  line-height: 1.1em;
  letter-spacing: 3px;
  text-align: center;
  font-weight: 300;
  margin-top: 20%;
}

.desc {
  margin-top: 8px;
}

.account {
  margin-top: 45%;
  font-size: 10px;
}

p {
  font-family: "Open Sans", sans-serif;
  font-size: 0.7em;
  letter-spacing: 2px;
  color: #8e9aaf;
  text-align: center;
}

span {
  color: #eac7cc;
}

/* 图片 */
.flower {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 46%;
  left: 29%;
  opacity: 0.7;
}

.smaller {
  width: 90px;
  height: 100px;
  top: 48%;
  left: 38%;
  opacity: 0.9;
}

/* 按钮 */
button {
  padding: 12px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 11px;
  border-radius: 10px;
  margin: auto;
  outline: none;
  display: block;
}

button:hover {
  background: #eac7cc;
  color: #f6f6f6;
  transition: background-color 1s ease-out;
}

.button {
  margin-top: 3%;
  background: #f6f6f6;
  color: #c98b95;
  border: 1px solid #eac7cc;
}

/* 表单 */
form {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 7px;
}

.more-padding {
  padding-top: 35px;
}

.more-padding input {
  padding: 12px;
}

.more-padding .submit {
  margin-top: 45px;
}

.submit {
  margin-top: 25px;
  padding: 12px;
  border-color: #c98b95;
}

.submit:hover {
  background: #cbc0d3;
  border-color: #bfb3c9;
}

/* 输入框 */
input {
  background: #eac7cc;
  width: 65%;
  color: #c98b95;
  border: none;
  border-bottom: 1px solid rgba(246, 246, 246, 0.5);
  padding: 9px;
}

input::placeholder {
  color: rgba(246, 246, 246, 1);
  letter-spacing: 2px;
  font-size: 1.3em;
  font-weight: 100;
}

input:focus {
  color: #c98b95;
  outline: none;
  border-bottom: 1.2px solid rgba(201, 139, 149, 0.7);
  font-size: 1em;
  transition: 0.8s all ease;
}

input:focus::placeholder {
  opacity: 0;
}

/* label & checkbox */
label {
  font-family: "Open Sans", sans-serif;
  color: #c98b95;
  font-size: 0.8em;
  letter-spacing: 1px;
}

.checkbox {
  margin-top: 8px;
}

.check-wrap {
  display: flex;
  align-items: center;
  gap: 6px; /* 勾选框和文字间距 */
  cursor: pointer;
  user-select: none;
  font-size: 0.9em;
  color: #c98b95; /* 文字颜色 */
}

.check-wrap input {
  display: none; /* 隐藏原生勾选框 */
}

.check-box {
  width: 15px;
  height: 15px;
  border: 1.5px solid #c98b95;
  border-radius: 2px;
  position: relative;
  box-sizing: border-box;
}

/* 勾 ✔ */
.check-wrap input:checked + .check-box::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 1px;
  width: 6px;
  height: 9px;
  border: solid #584c4e;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}

/* 文本 */
.check-text {
  user-select: none;
}
</style>
