<template>
  <div class="max-w-5xl mx-auto px-6 py-10 theme-pink">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-text mb-6">地址管理</h1>
      <div>
        <v-btn
          @click="openAdd"
          :style="{ background: 'var(--c-primary)', color: '#fff' }"
        >
          新增地址
        </v-btn>
      </div>
    </div>
    <ClientOnly>
      <div
        v-if="loading && addresses.length === 0"
        class="flex justify-center py-20"
      >
        <three-body-loader class="w-16 h-16" />
      </div>

      <div v-else>
        <div v-if="addresses.length === 0" class="text-muted">
          你还没有保存任何地址，点击“新增地址”开始添加。
        </div>

        <ul class="space-y-4 min-h-[160px]">
          <li
            v-for="addr in addresses"
            :key="addr.id"
            class="p-4 rounded-lg bg-surface border flex justify-between items-start"
            :style="{ borderColor: 'var(--c-border)' }"
          >
            <div>
              <div class="flex items-center gap-3">
                <div class="font-medium text-text">
                  {{ addr.name }} · {{ addr.phone }}
                </div>
                <span
                  v-if="addr.isDefault"
                  class="px-2 py-0.5 text-xs rounded bg-primary text-white"
                  >默认</span
                >
              </div>
              <div class="text-sm text-muted mt-1">
                {{ addr.province }} {{ addr.city }} {{ addr.district }}
                {{ addr.address }}
              </div>
            </div>

            <div class="flex items-end gap-2 justify-center">
              <v-btn text small @click="openEdit(addr)">编辑</v-btn>
              <v-btn
                text
                small
                color="error"
                @click="openDeleteConfirm(addr.id)"
                >删除</v-btn
              >
              <v-btn text small v-if="!addr.isDefault" @click="setDefault(addr)"
                >设为默认</v-btn
              >
            </div>
          </li>
        </ul>
      </div>
    </ClientOnly>

    <v-dialog v-model="dialog" max-width="640">
      <v-card class="bg-surface">
        <v-card-title class="text-text">{{
          editMode ? "编辑地址" : "新增地址"
        }}</v-card-title>
        <v-divider />
        <v-card-text>
          <v-overlay :model-value="formLoading" contained>
            <v-progress-circular indeterminate size="48" />
          </v-overlay>

          <v-form ref="formRef" v-model="valid" :disabled="formLoading">
            <v-text-field
              v-model="form.name"
              label="收件人"
              :rules="[rules.required]"
            />
            <v-text-field
              v-model="form.phone"
              label="手机号"
              :rules="[rules.required, rules.phone]"
            />

            <v-select
              v-model="form.areaId"
              :items="areas"
              item-title="name"
              item-value="id"
              label="地区（大区，例如：华东）"
            />
            <v-select
              v-model="form.provinceId"
              :items="provinces"
              item-title="name"
              item-value="id"
              label="省/直辖市"
              :rules="[rules.required]"
              :return-object="false"
              :disabled="provinces.length === 0"
            />

            <v-select
              v-model="form.cityId"
              :items="cities"
              item-title="name"
              item-value="id"
              label="市"
              :rules="[rules.required]"
              :disabled="cities.length === 0"
            />

            <v-select
              v-model="form.districtId"
              :items="districts"
              item-title="name"
              item-value="id"
              label="区/县"
              :rules="[rules.required]"
              :disabled="districts.length === 0"
            />

            <v-text-field
              v-model="form.address"
              label="详细地址"
              :rules="[rules.required]"
            />
            <v-switch v-model="form.isDefault" label="设为默认地址" />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-end fixed bottom-1 right-1">
          <v-btn text @click="dialog = false">取消</v-btn>
          <v-btn
            :style="{ background: 'var(--c-primary)', color: '#fff' }"
            :loading="saving"
            @click="save"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialogVisible" max-width="420">
      <v-card>
        <v-card-title class="font-medium text-red-600">
          确认删除地址
        </v-card-title>

        <v-card-text class="text-sm text-muted">
          删除后地址将无法恢复，确定要删除该地址吗？
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialogVisible = false">取消</v-btn>
          <v-btn color="red" :loading="deleteLoading" @click="onDeleteAddress">
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts" client>
import { ref, reactive, onMounted, watch } from "vue";
import ThreeBodyLoader from "~/assets/base-ui/ThreeBodyLoader.vue";
import { useAreaCascade } from "~/composables/useAreaCascade";
import type { AddressItem } from "~/types/api/addresses";

definePageMeta({ layout: "profile", requiresAuth: true });

const { $api } = useNuxtApp();

const {
  areas,
  provinces,
  cities,
  districts,
  loading: areaLoading,
  loadAreas,
  loadProvinces,
  cache,
  loadCities,
  loadDistricts,
  loadProvincesForAreas,
} = useAreaCascade($api);

const addresses = ref<AddressItem[]>([]);
const loading = ref(false);
const dialog = ref(false);
const editMode = ref(false);
const saving = ref(false);
const valid = ref(false);
const formRef = ref<any>(null);

// 回填/联动控制
const isEditing = ref(false); // 回填期间阻止 watch 的联动
const formLoading = ref(false); // 表单 overlay loading

const deleteDialogVisible = ref(false);
const deleteLoading = ref(false);
const currentAddressId = ref();

const form = reactive({
  id: null as number | null,
  name: "",
  phone: "",
  zip: 0,
  areaId: null as number | null,
  provinceId: null as number | null,
  cityId: null as number | null,
  districtId: null as number | null,
  province: "",
  city: "",
  district: "",
  address: "",
  isDefault: false,
});

const rules = {
  required: (v: string) => !!v || "必填项",
  phone: (v: string) => !v || /^1[3-9]\d{9}$/.test(v) || "手机号格式不正确",
};

watch(
  () => form.areaId,
  async (areaId) => {
    if (isEditing.value) return;
    // 清空下级选择和显示
    form.provinceId = null;
    form.cityId = null;
    form.districtId = null;
    form.province = "";
    form.city = "";
    form.district = "";
    provinces.value = [];
    cities.value = [];
    districts.value = [];
    if (!areaId) return;
    await loadProvinces(areaId);
    provinces.value = cache.provincesByArea.get(areaId) ?? [];
  }
);

watch(
  () => form.provinceId,
  async (provinceId) => {
    if (isEditing.value) return;
    form.cityId = null;
    form.districtId = null;
    form.city = "";
    form.district = "";
    cities.value = [];
    districts.value = [];
    if (!provinceId) return;
    await loadCities(provinceId);
    cities.value = cache.citiesByProvince.get(provinceId) ?? [];
  }
);

watch(
  () => form.cityId,
  async (cityId) => {
    if (isEditing.value) return;
    form.districtId = null;
    form.district = "";
    districts.value = [];
    if (!cityId) return;
    await loadDistricts(cityId);
    districts.value = cache.districtsByCity.get(cityId) ?? [];
  }
);

watch(
  () => form.districtId,
  (val) => {
    const d = districts.value.find((x) => x.id === val);
    form.district = d ? d.name : "";
  }
);

//获取地址列表
async function fetchList() {
  loading.value = true;
  try {
    const res = await $api.addresses.getAddressList();
    addresses.value = res?.list ?? res ?? [];
  } catch (err) {
    console.error("获取地址失败", err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // 先加载大区
  await loadAreas();

  // const missingAreaIds = areas.value
  //   .filter((a: any) => !cache.provincesByArea.has(a.id))
  //   .map((a: any) => a.id);
  // if (missingAreaIds.length) {
  //   try {
  //     await loadProvincesForAreas(missingAreaIds);
  //   } catch (e) {
  //     // 若失败，不要阻塞主流程，后续按需加载
  //     console.warn("预加载省份失败，后续按需加载", e);
  //   }
  // }
  await fetchList();
});

function openAdd() {
  editMode.value = false;
  isEditing.value = false;
  Object.assign(form, {
    id: null,
    name: "",
    phone: "",
    zip: 0,
    areaId: null,
    provinceId: null,
    cityId: null,
    districtId: null,
    province: "",
    city: "",
    district: "",
    address: "",
    isDefault: false,
  });
  // 清空下拉 items（用户选择时会触发 watch 去加载）
  provinces.value = [];
  cities.value = [];
  districts.value = [];
  dialog.value = true;
}

async function openEdit(a: AddressItem) {
  editMode.value = true;
  dialog.value = true;
  formLoading.value = true;
  isEditing.value = true;

  try {
    // 先填回显示字段（文本）
    Object.assign(form, {
      id: a.id,
      name: a.name,
      phone: a.phone,
      zip: a.zip ?? 0,
      address: a.address,
      isDefault: !!a.isDefault,
      province: a.province ?? "",
      city: a.city ?? "",
      district: a.district ?? "",
      areaId: null,
      provinceId: null,
      cityId: null,
      districtId: null,
    });

    // 确保 areas 已加载（一般已在 onMounted 加载）
    if (!areas.value.length) {
      await loadAreas();
    }

    // 先尝试用 cache 找出该 province 属于哪个 area
    let matchedAreaId: number | null = null;
    let matchedProvince: any = null;

    // 如果很多 area 的 provinces 还没缓存：先并行加载缺失的省份（加速回填）
    const notCachedAreaIds = areas.value
      .filter((ar: any) => !cache.provincesByArea.has(ar.id))
      .map((ar: any) => ar.id);
    if (notCachedAreaIds.length) {
      try {
        await loadProvincesForAreas(notCachedAreaIds);
      } catch (e) {
        // 不阻断，后续逐个按需加载也可
        console.warn("批量预加载 provinces 失败，继续按需加载", e);
      }
    }

    // 逐个 area 查找匹配的 province name（trim 比对）
    const wantProvinceName = (form.province ?? "").trim();
    for (const area of areas.value) {
      // 若该 area 的 provinces 仍然缺失，则按需加载（保证 cache 可用）
      if (!cache.provincesByArea.has(area.id)) {
        await loadProvinces(area.id);
      }
      const provs = cache.provincesByArea.get(area.id) ?? [];
      const p = provs.find(
        (x: any) => (x.name ?? "").trim() === wantProvinceName
      );
      if (p) {
        matchedAreaId = area.id;
        matchedProvince = p;
        break;
      }
    }

    if (!matchedAreaId || !matchedProvince) {
      // 未能反推到 province 的 id —— 仅保留文本回显，用户需手动选择
      console.warn("openEdit: 未匹配到省（仅回显名字），用户可手动选择");
      return;
    }

    // --- 回填：先确保下拉 items（provinces/cities/districts）准备好并与 cache 同步 ---
    // provinces items
    provinces.value = cache.provincesByArea.get(matchedAreaId) ?? [];
    form.areaId = matchedAreaId;
    form.provinceId = matchedProvince.id;
    form.province = matchedProvince.name;

    // cities items（优先从 cache，若无则按需加载）
    if (!cache.citiesByProvince.has(matchedProvince.id)) {
      // 如果 cache 丢失，按需加载
      await loadCities(matchedProvince.id);
    }
    const cityList = cache.citiesByProvince.get(matchedProvince.id) ?? [];
    cities.value = cityList;

    // 匹配 city
    const wantCityName = (form.city ?? "").trim();
    const matchedCity = cityList.find(
      (c: any) => (c.name ?? "").trim() === wantCityName
    );
    if (matchedCity) {
      form.cityId = matchedCity.id;
      form.city = matchedCity.name;

      // districts items
      if (!cache.districtsByCity.has(matchedCity.id)) {
        await loadDistricts(matchedCity.id);
      }
      const districtList = cache.districtsByCity.get(matchedCity.id) ?? [];
      districts.value = districtList;

      const wantDistrictName = (form.district ?? "").trim();
      const matchedDistrict = districtList.find(
        (d: any) => (d.name ?? "").trim() === wantDistrictName
      );
      if (matchedDistrict) {
        form.districtId = matchedDistrict.id;
        form.district = matchedDistrict.name;
      }
    }
  } catch (e) {
    console.error("openEdit 回填失败", e);
  } finally {
    isEditing.value = false;
    formLoading.value = false;
  }
}

async function save() {
  const ok = await formRef.value?.validate();
  if (!ok) return;
  saving.value = true;

  try {
    // 确保必要的下级 cache 存在（按需加载，避免找不到 name）
    if (
      form.provinceId != null &&
      !cache.citiesByProvince.has(form.provinceId)
    ) {
      await loadCities(form.provinceId);
    }
    if (form.cityId != null && !cache.districtsByCity.has(form.cityId)) {
      await loadDistricts(form.cityId);
    }

    // 从当前 items / cache 中派生名字（优先从 cache）
    const derivedProvince =
      (
        provinces.value.find((p: any) => p.id === form.provinceId) ??
        Array.from(cache.provincesByArea.values())
          .flat()
          .find((p: any) => p.id === form.provinceId)
      )?.name ??
      form.province ??
      "";

    const derivedCity =
      (cache.citiesByProvince.get(form.provinceId ?? -1) ?? cities.value).find(
        (c: any) => c.id === form.cityId
      )?.name ??
      form.city ??
      "";

    const derivedDistrict =
      (cache.districtsByCity.get(form.cityId ?? -1) ?? districts.value).find(
        (d: any) => d.id === form.districtId
      )?.name ??
      form.district ??
      "";

    // 校验：确保 id->name 成功（可选）
    if (!derivedProvince || !derivedCity || !derivedDistrict) {
      // 这里你可以提示用户完整选择，或者继续提交（视后端容忍度）
      $toast?.error?.("请选择完整的省/市/区");
      saving.value = false;
      return;
    }

    // 构造发送给后端的 payload（把 isDefault 转为 1/0）
    const payload = {
      ...form,
      province: derivedProvince,
      city: derivedCity,
      district: derivedDistrict,
      isDefault: form.isDefault ? true : false,
    };

    if (editMode.value) {
      await $api.addresses.updateAddress(form.id, payload);
    } else {
      await $api.addresses.createAddress(payload);
    }

    $toast?.success?.(editMode.value ? "保存成功" : "新增成功");
    dialog.value = false;
    await fetchList();
  } catch (err) {
    console.error(err);
    $toast?.error?.("保存失败");
  } finally {
    saving.value = false;
  }
}

async function onDeleteAddress() {
  deleteDialogVisible.value = true;
  try {
    await $api.addresses.deleteAddress(currentAddressId.value);
    $toast.success?.("删除成功");
    await fetchList();
  } catch (err) {
    $toast.error?.("删除失败");
  } finally {
    deleteDialogVisible.value = false;
  }
}
function openDeleteConfirm(id: number) {
  deleteDialogVisible.value = true;
  currentAddressId.value = id;
}

async function setDefault(a: any) {
  try {
    await $api.addresses.setAddressDefault(a.id);
    $toast?.success?.("已设为默认地址");
    await fetchList();
  } catch (err) {
    console.error(err);
    $toast?.error?.("操作失败");
  }
}
</script>

<style scoped></style>
