export interface AddressPayload {
  province: string;
  city: string;
  district: string;
  address: string;
  zip: number;
  name: string;
  phone: string;
  isDefault: boolean;
}

export interface CreateAddressPayload extends AddressPayload {}

export interface UpdateAddressPayload extends AddressPayload {}

export interface AddressListResponse {
  list: AddressItem[];
  totalCount: number;
}

export interface AddressItem {
  id: number;
  userId: number;
  province: string;
  city: string;
  district: string;
  address: string;
  zip: number;
  name: string;
  phone: number;
  isDefault: number;
  lastUsedTime: string;
  createTime: string;
  updateTime: string;
}
