import type { MyRequest } from "~/plugins/axios";
import goods from "./goods";
import user from "./user";
import cart from "./cart";
import addresses from "./addresses";
import areas from "./areas";

export default (api: MyRequest) => ({
  goods: goods(api),
  user: user(api),
  cart: cart(api),
  addresses: addresses(api),
  areas: areas(api),
});
