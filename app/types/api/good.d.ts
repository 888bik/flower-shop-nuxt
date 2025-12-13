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
