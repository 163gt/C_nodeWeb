import { PublishContentDto } from './publishContentDto';

export interface ContentResponse {
  contentId: string;
  badgeId: string;
  content: string;
  likeCount: number;
  viewCount: number;
  createdAt: string | Date;
}

export interface ContentListResponse {
  contents: ContentResponse[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
