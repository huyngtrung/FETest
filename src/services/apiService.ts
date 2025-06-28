import { Post, CreatePostData, UpdatePostData, ApiResponse } from '@/types/api';
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
        // Ignore parsing errors for error responses
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (error) {
        throw new Error('Invalid JSON response from server');
      }
    } else {
      return {
        data: null,
        message: 'Success (non-JSON response)',
        success: true,
      };
    }

    //wrap response in ApiResponse format if it's not already
    if (data && typeof data === 'object' && !data.hasOwnProperty('success')) {
      return {
        data: data,
        message: 'Success',
        success: true,
      };
    }

    return data;
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
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached posts data');
      return cachedData;
    }

    try {
      const response = await this.makeRequest<any>(endpoint);
      console.log('API Response:', response);

      let result;
      if (
        response.data &&
        response.data.posts &&
        Array.isArray(response.data.posts)
      ) {
        result = {
          data: response.data.posts,
          message: 'Success',
          success: true,
          pagination: {
            current_page: response.data.current_page,
            total_page: response.data.total_page,
            total: response.data.total,
            page_size: response.data.page_size,
          },
        };
      } else if (response.posts && Array.isArray(response.posts)) {
        result = {
          data: response.posts,
          message: 'Success',
          success: true,
          pagination: {
            current_page: response.current_page || 1,
            total_page: response.total_page || 0,
            total: response.total || 0,
            page_size: response.page_size || 10,
          },
        };
      } else {
        result = {
          data: [],
          message: 'No posts found',
          success: true,
          pagination: {
            current_page: 1,
            total_page: 0,
            total: 0,
            page_size: 10,
          },
        };
      }

      //cache the result
      cacheService.set(cacheKey, result, 3 * 60 * 1000); // Cache for 3 minutes
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
      const response = await this.makeRequest<any>(`/posts/${id}`, {
        method: 'DELETE',
      });

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

    //check cache first
    const cachedTags = cacheService.get(cacheKey);
    if (cachedTags) {
      console.log('Returning cached tags data');
      return cachedTags;
    }

    const result = await this.makeRequest<string[]>('/posts/tags');

    //cache the result for longer time since tags don't change often
    cacheService.set(cacheKey, result, 10 * 60 * 1000);

    return result;
  }
}
