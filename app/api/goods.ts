import type { MyRequest } from "~/plugins/axios";
import type {
  CategoryListResponse,
  GoodsListResponse,
  ProductListResponse,
} from "~/types/api/good";

export default (api: MyRequest) => ({
  getGoodsList(page: number) {
    return api.get<GoodsListResponse>(`/admin/goods/${page}?tab=all`);
  },
  getProductList(page?: number) {
    return api.get<ProductListResponse>(`/mall/goods`, {
      params: { page, limit: 33 },
    });
  },
  getCategoryList() {
    return api.get<CategoryListResponse[]>("/mall/categories");
  },
});
