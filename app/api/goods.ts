import type { MyRequest } from "~/plugins/axios";
import type {
  CategoryListResponse,
  ProductListResponse,
} from "~/types/api/good";

export default (api: MyRequest) => ({
  getProductList(page?: number) {
    return api.get<ProductListResponse>(`/mall/goods`, {
      params: { page, limit: 33 },
    });
  },
  getCategoryList() {
    return api.get<CategoryListResponse[]>("/mall/categories");
  },
});
