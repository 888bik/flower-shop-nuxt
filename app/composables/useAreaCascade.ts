import { ref } from "vue";

export function useAreaCascade($api: any) {
  const areas = ref<any[]>([]);
  const provinces = ref<any[]>([]); // 当前选中 area 的 provinces（保留用于组件绑定）
  const cities = ref<any[]>([]);
  const districts = ref<any[]>([]);

  const loading = ref({
    areas: false,
    provinces: false,
    cities: false,
    districts: false,
  });

  // 缓存：按 areaId/provinceId/cityId 缓存下级列表
  const cache = {
    provincesByArea: new Map<number, any[]>(),
    citiesByProvince: new Map<number, any[]>(),
    districtsByCity: new Map<number, any[]>(),
  };

  // 简单竞态保护：只接受最新请求结果
  const reqId = { provinces: 0, cities: 0, districts: 0 };

  async function loadAreas() {
    loading.value.areas = true;
    try {
      const res = await $api.areas.getAreasList();
      areas.value = res ?? [];
    } catch (e) {
      console.error("loadAreas", e);
      areas.value = [];
    } finally {
      loading.value.areas = false;
    }
  }

  async function loadProvinces(areaId: number | null) {
    provinces.value = []; // 清空当前显示（组件绑定）
    if (!areaId) return;

    // 缓存直接返回
    if (cache.provincesByArea.has(areaId)) {
      provinces.value = cache.provincesByArea.get(areaId)!;
      return cache.provincesByArea.get(areaId)!;
    }

    loading.value.provinces = true;
    const myId = ++reqId.provinces;
    try {
      const res = await $api.areas.getProvincesList(areaId);
      // 竞态保护：只写入最后一次请求的结果
      if (myId === reqId.provinces) {
        const arr = res ?? [];
        provinces.value = arr;
        cache.provincesByArea.set(areaId, arr);
        return arr;
      } else {
        return cache.provincesByArea.get(areaId) ?? [];
      }
    } catch (e) {
      console.error("loadProvinces", e);
      provinces.value = [];
      return [];
    } finally {
      loading.value.provinces = false;
    }
  }

  async function loadCities(provinceId: number | null) {
    cities.value = [];
    districts.value = [];
    if (!provinceId) return;

    if (cache.citiesByProvince.has(provinceId)) {
      cities.value = cache.citiesByProvince.get(provinceId)!;
      return cache.citiesByProvince.get(provinceId)!;
    }

    loading.value.cities = true;
    const myId = ++reqId.cities;
    try {
      const res = await $api.areas.getCityList(provinceId);
      if (myId === reqId.cities) {
        const arr = res ?? [];
        cities.value = arr;
        cache.citiesByProvince.set(provinceId, arr);
        return arr;
      } else {
        return cache.citiesByProvince.get(provinceId) ?? [];
      }
    } catch (e) {
      console.error("loadCities", e);
      cities.value = [];
      return [];
    } finally {
      loading.value.cities = false;
    }
  }

  async function loadDistricts(cityId: number | null) {
    districts.value = [];
    if (!cityId) return;

    if (cache.districtsByCity.has(cityId)) {
      districts.value = cache.districtsByCity.get(cityId)!;
      return cache.districtsByCity.get(cityId)!;
    }

    loading.value.districts = true;
    const myId = ++reqId.districts;
    try {
      const res = await $api.areas.getDistrictsList(cityId);
      if (myId === reqId.districts) {
        const arr = res ?? [];
        districts.value = arr;
        cache.districtsByCity.set(cityId, arr);
        return arr;
      } else {
        return cache.districtsByCity.get(cityId) ?? [];
      }
    } catch (e) {
      console.error("loadDistricts", e);
      districts.value = [];
      return [];
    } finally {
      loading.value.districts = false;
    }
  }

  // helper：并行加载指定 areaId 列表的 provinces（用于 openEdit 批量预热）
  async function loadProvincesForAreas(areaIds: number[]) {
    const tasks = areaIds.map((id) => {
      if (cache.provincesByArea.has(id))
        return Promise.resolve(cache.provincesByArea.get(id)!);
      return $api.areas
        .getProvincesList(id)
        .then((res: any[]) => {
          const arr = res ?? [];
          cache.provincesByArea.set(id, arr);
          return arr;
        })
        .catch((e: any) => {
          console.error("loadProvincesForAreas item", id, e);
          cache.provincesByArea.set(id, []);
          return [];
        });
    });
    // 并行等待，但不破坏当前 provinces.value（组件绑定）
    await Promise.all(tasks);
  }

  return {
    areas,
    provinces,
    cities,
    districts,
    loading,
    cache, // 暴露缓存，openEdit 可以直接读取（只读使用）
    loadAreas,
    loadProvinces,
    loadCities,
    loadDistricts,
    loadProvincesForAreas,
  };
}
