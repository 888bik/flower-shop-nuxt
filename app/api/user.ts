import type { MyRequest } from "~/plugins/axios";
import type {
  CreateUserPayload,
  FavoritesGoodsList,
  toggleFavoriteResponse,
  UpdateUserPayload,
} from "~/types/api/user";

export default (api: MyRequest) => ({
  userRegister(payload: CreateUserPayload) {
    return api.post("/user/register", { ...payload });
  },
  userLogin(username: string, password: string) {
    return api.post<{ refreshToken: string; accessToken: string }>(
      "/user/login",
      { username, password }
    );
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
  toggleGoodsFavorite(id: number, status: boolean) {
    return api.post<toggleFavoriteResponse>(
      `/user/favorite/${id}?favorite=${status}`
    );
  },
  checkGoodsFavorite(id: number) {
    return api.get<boolean>(`/user/favorite/${id}`);
  },
  getFavoritesGoods() {
    return api.get<FavoritesGoodsList>("/user/favorites");
  },
  refreshToken(refreshToken: string, role: string = "user") {
    return api.post("/auth/refresh", { refreshToken, role });
  },
});
