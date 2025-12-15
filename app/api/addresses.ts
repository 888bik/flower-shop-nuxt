import type { MyRequest } from "~/plugins/axios";
import type {
  AddressItem,
  AddressListResponse,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "~/types/api/address";

export default (api: MyRequest) => ({
  createAddress(payload: CreateAddressPayload) {
    return api.post("/user/addresses", { ...payload });
  },
  updateAddress(id: number | null, payload: UpdateAddressPayload) {
    return api.put(`/user/addresses/${id}`, { ...payload });
  },
  deleteAddress(id: number) {
    return api.delete(`/user/addresses/${id}`);
  },
  getAddressList() {
    return api.get<AddressListResponse>("user/addresses");
  },
  getAddressOne(id: number) {
    return api.get<AddressItem>(`/user/addresses/${id}`);
  },
  setAddressDefault(id: number) {
    return api.post(`/user/addresses/${id}/default`);
  },
});
