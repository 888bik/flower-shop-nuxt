import type { MyRequest } from "~/plugins/axios";
import type { CreateUserPayload, UpdateUserPayload } from "~/types/api/user";

export default (api: MyRequest) => ({
  userRegister(payload: CreateUserPayload) {
    return api.post("/user/register", { ...payload });
  },
  userLogin(username: string, password: string) {
    return api.post("/user/login", { username, password });
  },
  getUserInfo() {
    return api.get("/user/profile");
  },
  uploadAvatar(formData: any) {
    return api.post("/user/upload-avatar");
  },
  updateUser(payload: UpdateUserPayload) {
    return api.post("/user/update", { ...payload });
  },
  userLogout() {
    return api.post("/user/logout");
  },
});
