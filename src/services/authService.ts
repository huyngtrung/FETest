import { LoginResponse, User } from '@/types/auth';
import { removeAuthTokens, getRefreshToken } from '@/lib/auth';

export class AuthService {
  private static baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://api-test-web.agiletech.vn';

  static async login(username: string): Promise<LoginResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.accessToken && data.refreshToken) {
        //Decode JWT to get user info
        const tokenPayload = JSON.parse(atob(data.accessToken.split('.')[1]));
        const user: User = {
          id: tokenPayload.id.toString(),
          email: `${username}@example.com`,
          name: tokenPayload.username,
        };

        return {
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user,
        };
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/auth/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return data.accessToken || null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(
          'Logout request failed, but continuing with local cleanup'
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthTokens();
    }
  }
}
