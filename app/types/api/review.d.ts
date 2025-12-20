export interface ReviewItem {
  id: number;
  rating: number;
  content: string;
  photos: string[];
  reviewTime: number;
  anonymous: boolean;
  user: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export interface ReviewListResponse {
  total: number;
  page: number;
  pageSize: number;
  avgRating: number;
  list: ReviewItem[];
}
