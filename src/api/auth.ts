import request from '@/utils/request';

interface RefreshTokenParams {
    token: string | null;
    refreshToken: string | null;
}

interface RefreshTokenResult {
    token: string;
    refreshToken: string;
}

/** 刷新 token（路径按后端接口调整） */
export const refreshTokenApi = (params: RefreshTokenParams) =>
    request.post<RefreshTokenResult>('/auth/refresh', params);
