import type { MyRequest } from "~/plugins/axios";
import type {
  CouponAllListResponse,
  CouponUserListResponse,
} from "~/types/api/coupon";

export default (api: MyRequest) => ({
  getAllCouponList() {
    return api.get<CouponAllListResponse>("/user/coupon/all");
  },
  getUserCouponList() {
    return api.get<CouponUserListResponse>("/user/coupon/list");
  },
  receiveCoupon(id: number) {
    return api.post(`/user/coupon/receive/${id}`);
  },
});
