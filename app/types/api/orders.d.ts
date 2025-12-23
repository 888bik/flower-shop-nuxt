export type shippingType = "express" | "standard";
export type payStatus = "unpaid" | "paid" | "refunded" | "closed";
export type refundStatus =
  | "none"
  | "pending"
  | "agreed"
  | "rejected"
  | "completed";
export interface OrderItem {
  goodsId: number;
  num: number;
  goodsTitle?: string;
  goodsCover?: string;
  price?: number;
  subtotal?: number;
  skuId?: number;
}

export interface OrderAddress {
  id: number;
  userId: number;
  province: string;
  city: string;
  district: string;
  address: string;
  zip: number;
  name: string;
  phone: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  addressId: number;
  shippingType: string;
  remark?: string | null;
  couponId?: number | null;
}

export interface CreateOrderResponse {
  orderNo: string;
  shipping: number;
  orderId: number;
  totalPrice: number;
  subtotal: number;
  discount: number;
}

export interface OrderDetailResponse {
  orderId: number;
  orderNo: string;
  subtotal: number;
  shipping: number;
  discount: number;
  totalPrice: number;
  shipStatus: string; // 例如: "pending"
  createTime: number; // Unix 时间戳（秒）
  expireTime: number;
  payStatus: payStatus;
  address: OrderAddress;
  items: OrderItem[]; // 商品列表
}

export interface OrderListItem {
  orderId: number;
  orderNo: string;
  totalPrice: number;
  shipStatus: string;
  createTime: number;
  payStatus: payStatus;
  refundStatus: refundStatus;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  expireTime: number | null;
  reviewed: boolean;
}

export interface OrderListResponse {
  list: OrderListItem[];
  totalCount: number;
}

export interface ShipDataResponse {
  company: {
    id: number;
    name: string;
    code: string;
  };
  shipping: {
    fee: number;
    name: string;
    type: string;
  };
  history: {
    time: string;
    status: string;
    location: string;
    desc: string;
  }[];
  trackingNo: string;
}

export interface submitReviewPayload {
  anonymous: boolean;
  items: {
    orderItemId: number;
    rating: number;
    content: string;
  }[];
}

export interface applyRefundPayload {
  orderId: number;
  reason: string;
  refundType: string;
}

export interface submitReturnPayload {
  orderId: number;
  reason: string;
}

export interface returnShipPayload {
  orderId: number;
  company: string;
  trackingNo: string;
}
