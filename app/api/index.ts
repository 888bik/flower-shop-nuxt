import type { MyRequest } from "~/plugins/axios";
import goods from "./goods";
import user from "./user";

export default (api: MyRequest) => ({
  goods: goods(api),
  user: user(api),
});
