export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  order: number;
  createTime: string;
  updateTime: string;
}

export interface NoticeListResponse {
  list: NoticeItem[];
  totalCount: number;
}
