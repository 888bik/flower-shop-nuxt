import { reactive, toRefs } from "vue";

export function useAuthFormNative() {
  // 表单数据（直接返回 reactive，模板 v-model 更直观）
  const signupForm = reactive({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginForm = reactive({
    username: "",
    password: "",
    rememberMe: false,
  });

  // 错误信息（每个 field 一条）
  const signupErrors = reactive({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginErrors = reactive({
    username: "",
    password: "",
  });

  // 验证函数（会设置对应的错误文本）
  function validateSignup() {
    // 清空
    Object.keys(signupErrors).forEach((k) => {
      // @ts-ignore
      signupErrors[k] = "";
    });

    let ok = true;
    if (!signupForm.username || signupForm.username.trim().length < 3) {
      signupErrors.username = "用户名至少 3 个字符";
      ok = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupForm.email || !emailPattern.test(signupForm.email)) {
      signupErrors.email = "请输入有效邮箱";
      ok = false;
    }

    if (!signupForm.password || signupForm.password.length < 6) {
      signupErrors.password = "密码至少 6 个字符";
      ok = false;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      signupErrors.confirmPassword = "两次输入密码不一致";
      ok = false;
    }

    return ok;
  }

  function validateLogin() {
    Object.keys(loginErrors).forEach((k) => {
      // @ts-ignore
      loginErrors[k] = "";
    });
    let ok = true;
    if (!loginForm.username || loginForm.username.trim() === "") {
      loginErrors.username = "用户名不能为空";
      ok = false;
    }
    if (!loginForm.password || loginForm.password === "") {
      loginErrors.password = "密码不能为空";
      ok = false;
    }
    return ok;
  }

  // 返回 reactive 对象 （模板里直接 v-model="signupForm.username"）
  return {
    signupForm,
    loginForm,
    signupErrors,
    loginErrors,
    validateSignup,
    validateLogin,
  };
}
