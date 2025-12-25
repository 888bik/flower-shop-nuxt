import Cookies from "js-cookie";

type TokenKey = "accessToken" | "refreshToken";

export function setToken(key: TokenKey, token: string, rememberMe = false) {
  const options = rememberMe
    ? { expires: 7 as number, secure: true, sameSite: "Lax" as const }
    : { secure: true, sameSite: "Lax" as const };

  Cookies.set(key, token, options);
}

export function getToken(key: TokenKey) {
  return Cookies.get(key);
}

export function removeToken(key: TokenKey) {
  Cookies.remove(key);
}
