import type { MyRequest } from "~/plugins/axios";
import type { AddCartPayload, CartItem } from "~/types/api/cart";

export default (api: MyRequest) => ({
  addCart(payload: AddCartPayload) {
    return api.post("/cart/add", { ...payload });
  },
  removeCart(cartId: number) {
    return api.delete(`/cart/remove/${cartId}`);
  },
  getCartList() {
    return api.get<CartItem[]>("/cart/list");
  },
  clearCart() {
    return api.post("/cart/clear");
  },
  updateNum(cartId: number, num: number) {
    return api.post("/cart/updateNum", { cartId, num });
  },
});
