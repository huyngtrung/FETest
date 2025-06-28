import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const setAuthTokens = (token: string, refreshToken: string) => {
  //accessToken expires in 1 minute, refreshToken expires in 1 day
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 2 / (24 * 60) }); // 1 minute
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 1 }); // 1 day
};

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeAuthTokens = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
