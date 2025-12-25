import type { MyRequest } from "~/plugins/axios";
import type { HomeFloor } from "~/types/api/home";

export default (api: MyRequest) => ({
  getHomeFloors() {
    return api.get<HomeFloor[]>("/home/floors");
  },
});
