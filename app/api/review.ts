import type { MyRequest } from "~/plugins/axios";
import type { ReviewListResponse } from "~/types/api/review";

export default (api: MyRequest) => ({
  getReviewList(goodsId: Number) {
    return api.get<ReviewListResponse>(`/user/review/${goodsId}`);
  },
});
