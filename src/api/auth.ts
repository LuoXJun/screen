import { refreshClient } from '@/utils/request/refreshClient';

interface RefreshTokenParams {
    token: string | null;
    refreshToken: string | null;
}

interface RefreshTokenResult {
    token: string;
    refreshToken: string;
}

/** 刷新 token（路径按后端接口调整；经裸客户端发送,避免刷新请求 401 重入业务拦截链） */
export const refreshTokenApi = (params: RefreshTokenParams) =>
    refreshClient.post<ResponseDataType<RefreshTokenResult>>('/auth/refresh', params);
