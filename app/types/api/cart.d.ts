export interface AddCartPayload {
  goodsId: string | number;
  num: number | string;
}

export interface CartItem {
  id: number;
  userId: number;
  goodsId: number;
  num: number;
  /** 秒级时间戳（后端是 second） */
  createTime: number;
  updateTime: number;
  title: string;
  cover: string;
  unit: string;
  description: string;
  minPrice: number;
  minOprice: number;
  stock: number;
  saleCount: number;
  rating: number;

  skuId: number;
  skusType: boolean;
  skuTitle: string;
  skuStock: number;
  valid: boolean;
  checked: boolean;
}
