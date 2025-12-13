import { reactive, toRefs } from "vue";

export interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function useAuthForm() {
  // 表单数据
  const signupForm = reactive<SignupForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginForm = reactive<LoginForm>({
    username: "",
    password: "",
    rememberMe: false,
  });

  // 错误信息
  const signupErrors = reactive<Record<keyof SignupForm, string>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loginErrors = reactive<Record<keyof LoginForm, string>>({
    username: "",
    password: "",
    rememberMe: "",
  });

  // 注册校验
  function validateSignup() {
    let valid = true;

    // 重置错误
    Object.keys(signupErrors).forEach(
      (k) => (signupErrors[k as keyof SignupForm] = "")
    );

    if (!signupForm.username || signupForm.username.length < 3) {
      console.log(signupForm);
      signupErrors.username = "用户名至少 3 个字符";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupForm.email || !emailPattern.test(signupForm.email)) {
      signupErrors.email = "请输入有效邮箱";
      valid = false;
    }

    if (!signupForm.password || signupForm.password.length < 6) {
      signupErrors.password = "密码至少 6 个字符";
      valid = false;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      signupErrors.confirmPassword = "两次输入密码不一致";
      valid = false;
    }

    return valid;
  }

  // 登录校验
  function validateLogin() {
    let valid = true;
    Object.keys(loginErrors).forEach(
      (k) => (loginErrors[k as keyof LoginForm] = "")
    );

    if (!loginForm.username) {
      loginErrors.username = "用户名不能为空";
      valid = false;
    }

    if (!loginForm.password) {
      loginErrors.password = "密码不能为空";
      valid = false;
    }

    return valid;
  }

  return {
    signupForm,
    loginForm,
    signupErrors,
    loginErrors,
    validateSignup,
    validateLogin,
  };
}
