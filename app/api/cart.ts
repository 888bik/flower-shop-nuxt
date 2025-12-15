import type { MyRequest } from "~/plugins/axios";
import type { AddCartPayload, CartItem } from "~/types/api/cart";

export default (api: MyRequest) => ({
  addCart(payload: AddCartPayload) {
    return api.post("/user/cart/add", { ...payload });
  },
  removeCart(cartId: number) {
    return api.delete(`/user/cart/remove/${cartId}`);
  },
  getCartList() {
    return api.get<CartItem[]>("/user/cart/list");
  },
  clearCart() {
    return api.post("/user/cart/clear");
  },
  updateNum(cartId: number, num: number) {
    return api.post("/user/cart/updateNum", { cartId, num });
  },
});
