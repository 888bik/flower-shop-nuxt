import type { MyRequest } from "~/plugins/axios";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetailResponse,
  OrderListResponse,
} from "~/types/api/orders";

export default (api: MyRequest) => ({
  createOrder(payload: CreateOrderPayload) {
    return api.post<CreateOrderResponse>("/user/orders/create", { ...payload });
  },
  getOrderList(page: number = 1, limit: number = 10) {
    return api.get<OrderListResponse>("/user/orders", {
      params: { page, limit },
    });
  },
  getOrderDetail(id: number) {
    return api.get<OrderDetailResponse>(`/user/orders/${id}`);
  },
  payOrder(id: number, payMethod: "WECHAT" | "ALIPAY") {
    return api.post(`/user/orders/${id}/pay`, { payMethod });
  },
  cancelOrder(id: number) {
    return api.post(`/user/orders/${id}/cancel`);
  },
});
