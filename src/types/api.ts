
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
  data: T;
  message: string;
  success: boolean;
}
