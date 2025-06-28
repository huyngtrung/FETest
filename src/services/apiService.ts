import {
  Post,
  CreatePostData,
  UpdatePostData,
  ApiResponse,
  RawPostResponse,
} from '@/types/api';
import { getAuthToken } from '@/lib/auth';
import { cacheService } from '@/lib/cache';

export class ApiService {
  private static baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://api-test-web.agiletech.vn';

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        throw new Error(`${e}`);
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type') || '';
    let data: null = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (error) {
        throw new Error(`Invalid JSON response from server ${error}`);
      }
    } else {
      return {
        data: null,
        message: 'Success (non-JSON response)',
        success: true,
      };
    }

    //wrap response in ApiResponse format if it's not already
    if (data && typeof data === 'object' && !('success' in data)) {
      return {
        data: data,
        message: 'Success',
        success: true,
      };
    }

    return {
      data,
      message: 'Empty response or already formatted',
      success: data ?? false,
    };
  }

  static async getPosts(params?: {
    title?: string;
    page?: number;
    tags?: string;
  }): Promise<
    ApiResponse<Post[]> & {
      pagination?: {
        current_page: number;
        total_page: number;
        total: number;
        page_size: number;
      };
    }
  > {
    const queryParams = new URLSearchParams();
    if (params?.title) queryParams.append('title', params.title);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.tags) queryParams.append('tags', params.tags);

    const queryString = queryParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`;
    const cacheKey = `posts_${queryString}`;

    //check cache first
    const cachedData = cacheService.get<
      ApiResponse<Post[]> & {
        pagination?: {
          current_page: number;
          total_page: number;
          total: number;
          page_size: number;
        };
      }
    >(cacheKey);
    if (cachedData) {
      console.log('Returning cached posts data');
      return cachedData;
    }

    try {
      const response = await this.makeRequest<RawPostResponse>(endpoint);
      console.log('API Response:', response);

      const posts = response.data?.posts ?? [];
      const result = {
        data: posts,
        message: posts.length > 0 ? 'Success' : 'No posts found',
        success: true,
        pagination: {
          current_page: response.data?.current_page ?? 1,
          total_page: response.data?.total_page ?? 0,
          total: response.data?.total ?? 0,
          page_size: response.data?.page_size ?? 10,
        },
      };

      // Cache result
      cacheService.set(cacheKey, result, 3 * 60 * 1000);
      return result;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return {
        data: [],
        message: 'Failed to fetch posts',
        success: false,
        pagination: {
          current_page: 1,
          total_page: 0,
          total: 0,
          page_size: 10,
        },
      };
    }
  }

  static async createPost(data: CreatePostData): Promise<ApiResponse<Post>> {
    const result = await this.makeRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    //invalidate posts cache after creating new post
    cacheService.invalidatePattern('posts_');

    return result;
  }

  static async updatePost(
    id: string,
    data: UpdatePostData
  ): Promise<ApiResponse<Post>> {
    const result = await this.makeRequest<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    //invalidate posts cache after updating post
    cacheService.invalidatePattern('posts_');

    return result;
  }

  static async deletePost(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await this.makeRequest<null>(`/posts/${id}`, {
        method: 'DELETE',
      });
      console.log(response);

      const result = {
        data: null,
        message: 'Post deleted successfully',
        success: true,
      };

      //invalidate posts cache after deleting post
      cacheService.invalidatePattern('posts_');

      return result;
    } catch (error) {
      console.error('Error deleting post:', error);
      return {
        data: null,
        message: 'Failed to delete post',
        success: false,
      };
    }
  }

  static async getPostTags(): Promise<ApiResponse<string[]>> {
    const cacheKey = 'post_tags';

    const cachedTags = cacheService.get<ApiResponse<string[]>>(cacheKey);
    if (cachedTags) {
      console.log('Returning cached tags data');
      return cachedTags;
    }

    const result = await this.makeRequest<string[]>('/posts/tags');

    //cache trong 10 phút
    cacheService.set(cacheKey, result, 10 * 60 * 1000);

    return result;
  }
}
