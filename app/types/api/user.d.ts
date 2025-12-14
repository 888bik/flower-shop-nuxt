export interface CreateUserPayload {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserPayload {
  avatar: string;
  nickname: string;
  phone: string;
  email: string;
}

export interface Stats {
  cashOutPrice: string;
  shareOrderNum: number;
  orderPrice: string;
  commission: string;
  noCashOutPrice: string;
  shareNum: number;
}

export interface User {
  id: number;
  username: string;
  password: string;
  avatar: string;
  nickname: string;
  phone: string;
  email: string;
  userLevelId: number | null;
  createTime: string | null;
  updateTime: string | null;
  lastLoginTime: string | number;
  status: number;
  wechatOpenid: string | null;
  shareNum: number;
  shareOrderNum: number;
  orderPrice: number;
  commission: number;
  cashOutPrice: number;
  cashOutTime: number;
  noCashOutPrice: number;
  p1: string | null;
  p2: string | null;
  role: string;
}

export interface UserLevel {
  level: number;
  name: string;
  discount: number;
  id: number;
  maxPrice: number;
  maxTimes: number;
}

export interface UserProfile {
  addresses: any[];
  level: UserLevel | null;
  stats: Stats;
  bills: any[];
  user: User | null;
  info: any | null;
}
