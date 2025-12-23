import type { MyRequest } from "~/plugins/axios";
import type {
  applyRefundPayload,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetailResponse,
  OrderListResponse,
  returnShipPayload,
  ShipDataResponse,
  submitReturnPayload,
  submitReviewPayload,
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
  getShipData(id: number) {
    return api.get<ShipDataResponse>(`/user/orders/${id}/ship`);
  },
  confirmReceive(id: number) {
    return api.post(`/user/orders/${id}/receive`);
  },
  getReviewItems(id: number) {
    return api.get(`/user/orders/${id}/review/items`);
  },
  submitReview(id: number, payload: submitReviewPayload) {
    return api.post(`/user/orders/${id}/review`, { ...payload });
  },
  deleteOrder(ids: number[]) {
    return api.post("/user/orders/delete", { ids });
  },
  applyRefund(payload: applyRefundPayload) {
    return api.post("/user/orders/refund/apply", { ...payload });
  },
  submitReturn(payload: submitReturnPayload) {
    return api.post("/user/orders/refund/return", { ...payload });
  },
  submitReturnShip(payload: returnShipPayload) {
    return api.post("/user/orders/return/ship", { ...payload });
  },
});
