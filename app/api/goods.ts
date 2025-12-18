import type { MyRequest } from "~/plugins/axios";
import type {
  CategoryListResponse,
  GoodsDetailResponse,
  ProductListResponse,
} from "~/types/api/goods";

export default (api: MyRequest) => ({
  getProductList(page?: number) {
    return api.get<ProductListResponse>(`/mall/goods`, {
      params: { page, limit: 33 },
    });
  },
  getCategoryList() {
    return api.get<CategoryListResponse[]>("/mall/categories");
  },
  getGoodsDetail(id: number) {
    return api.get<GoodsDetailResponse>(`/mall/goods/${id}`);
  },
});
