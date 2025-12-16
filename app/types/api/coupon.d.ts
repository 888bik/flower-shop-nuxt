export interface CouponItem {
  id: number;
  name: string;
  type: number;
  value: number;
  minPrice: number;
  total: number;
  used: number;
  startTime: number;
  endTime: number;
  order: number;
  description: string | null;
  received: boolean;
  stock: number;
  scope: string;
  time: string;
}

export interface CouponAllListResponse {
  list: CouponItem[];
  totalCount: number;
}

export interface CouponUserListResponse {
  list: CouponItem[];
  expired: CouponItem[];
  totalCount: number;
}
