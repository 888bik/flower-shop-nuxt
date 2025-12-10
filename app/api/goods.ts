import type { MyRequest } from "~/plugins/axios";

export default (api: MyRequest) => ({
  getInfo(id: number) {
    return api.get(`/admin/goods/${id}?tab=all`);
  },
  getList(params?: any) {
    return api.get("/admin/goods", { params });
  },
});
