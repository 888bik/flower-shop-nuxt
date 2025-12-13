import type { MyRequest } from "~/plugins/axios";
import type { CreateUserPayload } from "~/types/api/user";

export default (api: MyRequest) => ({
  userRegister(payload: CreateUserPayload) {
    return api.post("/user/register", { ...payload });
  },
  userLogin(username: string, password: string) {
    return api.post("/user/login", { username, password });
  },
});
