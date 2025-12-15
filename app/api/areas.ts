import type { MyRequest } from "~/plugins/axios";
import type {
  AreaItem,
  CityItem,
  DistrictItem,
  ProvinceItem,
} from "~/types/api/areas";

export default (api: MyRequest) => ({
  getAreasList() {
    //返回大区，比如华东，华南
    return api.get<AreaItem[]>("/user/areas");
  },
  getProvincesList(areaId?: number) {
    return api.get<ProvinceItem[]>("/user/areas/provinces", {
      params: { areaId },
    });
  },
  getCityList(provinceId: number) {
    return api.get<CityItem[]>("/user/areas/cities", {
      params: { provinceId },
    });
  },
  getDistrictsList(cityId: number) {
    return api.get<DistrictItem[]>("/user/areas/districts", {
      params: { cityId },
    });
  },
});
