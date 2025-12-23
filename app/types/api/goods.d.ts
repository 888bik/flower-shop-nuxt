// 单个分类
export interface Category {
  id: number;
  name: string;
  status: number;
  createTime: number;
  updateTime: number;
  categoryId: number;
  order: number;
  type: string;
  typeId: number | null;
  typeName: string | null;
}

// 商品轮播图
export interface GoodsBanner {
  id: number;
  goodsId: number;
  url: string;
  createTime: number;
  updateTime: number;
}

// 商品主类型
export interface GoodsItem {
  id: number;
  title: string;

  categoryId: number;
  categoryIds: number[];
  categories: Category[];

  cover: string;
  rating: number;
  saleCount: number;
  reviewCount: number;

  minPrice: string;
  minOprice: string;
  description: string;

  unit: string;
  stock: number;
  minStock: number;

  ischeck: number;
  status: number;

  stockDisplay: number;
  expressId: number;

  skuType: number;
  skuValue: any | null;

  content: any | null;
  discount: number;

  createTime: number;
  updateTime: number;
  deleteTime: number | null;

  order: number;

  category: Category | null;

  goodsBanner: GoodsBanner[];
  goodsAttrs: any[];
  goodsSkus: any[];
  goodsSkusCard: any[];
}

// 整个接口响应的数据
export interface GoodsListResponse {
  cates: Category[];
  list: GoodsItem[];
}

export interface ProductItem {
  id: number;
  title: string;
  cover: string;
  rating: number | string;
  saleCount: number;
  unit: string;
  minPrice: string;
  minOprice: string;
  stock: number;
  minStock: number;
  categories: { id: number; name: string }[];
  banners: string[];
}

export interface ProductListResponse {
  pageSize: number;
  page: number;
  list: ProductItem[];
  totalCount: number;
}

export interface CategoryListResponse {
  id: number;
  name: string;
  status: number;
  createTime: string;
  updateTime: string;
  categoryId: number;
  order: number;
  type: number;
  typeId: number;
  typeName: string;
}

export interface GoodsPrice {
  min: number;
  max: number | null;
  originalMin: number;
  discount: number;
  currency: string; // e.g. "CNY"
  displayMin: string; // e.g. "¥271.00"
}

export interface GoodsSkuItem {
  skuId: number;
  image: string;
  price: number;
  stock: number;
  specs: GoodsSkuSpec[];
}
export interface GoodsSkuSpec {
  key: string; // e.g. "颜色"
  value: string; // e.g. "粉色"
}
export interface GoodsSkuCard {
  cardId: number;
  name: string; // e.g. "颜色"
  values: GoodsSkuCardValue[];
}

export interface GoodsSkuCardValue {
  id: number;
  value: string; // e.g. "粉色"
}

export interface GoodsStock {
  total: number;
  display: boolean;
  minStock: number;
}

export interface GoodsSales {
  saleCount: number;
  reviewCount: number;
  rating: number; // 5.0
}

// export interface GoodsDelivery {
//   expressId: number;
//   fee: number;
//   templateName: string | null;
// }

export interface GoodsDetailResponse {
  id: number;
  title: string;
  description: string | null;
  category: GoodsCategory;
  cover: string;
  banners: string[];
  price: GoodsPrice;
  sku: GoodsSku;
  stock: GoodsStock;
  sales: GoodsSales;
  unit: string; // "件"
  contentHtml: string | null;
  // delivery: GoodsDelivery;
  isAvailable: boolean;
  createTime: number; // 时间戳（秒/毫秒看后端约定）
  likeCount: number;
  isFavorite: boolean;
}

export interface searchItem {
  id: number;
  title: string;
  cover: string;
  minPrice: number;
  minOprice: number;
  rating: number;
  saleCount: number;
  reviewCount: number;
  description: string;
  unit: string;
}

export interface searchResponse {
  records: searchItem[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
