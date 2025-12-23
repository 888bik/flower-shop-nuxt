import type { MyRequest } from "~/plugins/axios";
import type {
  CategoryListResponse,
  GoodsDetailResponse,
  ProductListResponse,
  searchResponse,
} from "~/types/api/goods";

export default (api: MyRequest) => ({
  getProductList(
    page: number = 1,
    limit: number = 10,
    categoryIds: number | null
  ) {
    return api.get<ProductListResponse>(`/mall/goods`, {
      params: { page, limit, categoryIds },
    });
  },
  getCategoryList() {
    return api.get<CategoryListResponse[]>("/mall/categories");
  },
  getGoodsDetail(id: number) {
    return api.get<GoodsDetailResponse>(`/mall/goods/${id}`);
  },
  search(keyword: string, page: number = 1, limit: number = 12) {
    return api.get<searchResponse>(`/mall/search`, {
      params: { keyword, page, limit },
    });
  },
});
