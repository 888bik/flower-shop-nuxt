import type { MyRequest } from "~/plugins/axios";
import goods from "./goods";

export default (api: MyRequest) => ({
  goods: goods(api),
});
