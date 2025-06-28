
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}
