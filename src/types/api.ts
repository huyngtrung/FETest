export interface Post {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostData {
  title: string;
  description: string;
  tags: string[];
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface ApiResponse<T> {
  data: T | null;
  message: string;
  success: boolean;
}

export interface RawPostResponse {
  posts: Post[];
  current_page?: number;
  total_page?: number;
  total?: number;
  page_size?: number;
}
