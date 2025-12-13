// utils/token.ts
import Cookies from "js-cookie";

const DEFAULT_TOKEN_KEY = "auth_token";

export function setToken(
  token: string,
  rememberMe = false,
  tokenKey = DEFAULT_TOKEN_KEY
) {
  const options = rememberMe
    ? { expires: 7 as number, secure: true, sameSite: "Lax" as const } // 注意 TS 字面量类型
    : { secure: true, sameSite: "Lax" as const };

  Cookies.set(tokenKey, token, options);
}

export function getToken(tokenKey = DEFAULT_TOKEN_KEY) {
  return Cookies.get(tokenKey);
}

export function removeToken(tokenKey = DEFAULT_TOKEN_KEY) {
  Cookies.remove(tokenKey);
}
