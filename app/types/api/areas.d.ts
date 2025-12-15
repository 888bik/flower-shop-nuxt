export interface AreaItem {
  id: number;
  name: string;
  order: number;
}

export interface ProvinceItem {
  id: number;
  sysAreaId: number;
  name: string;
  order: number;
}

export interface CityItem {
  id: number;
  sysProvinceId: number;
  name: string;
  zip: string;
  order: number;
}

export interface DistrictItem {
  id: number;
  sysCityId: number;
  order: number;
}
