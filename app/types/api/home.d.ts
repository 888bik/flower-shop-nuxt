/** 首页商品卡片 */
export interface GoodsSimple {
  id: number;
  title: string;
  cover: string;
  rating: number;
  saleCount: number;
  banners: string[];
  minPrice: number;
  minOprice: number;
}

/** 首页楼层 */
export interface HomeFloor {
  id: number;
  title: string;
  categoryId: number;
  bannerImage: string;
  products: GoodsSimple[];
}
