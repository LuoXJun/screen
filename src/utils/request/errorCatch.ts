import { refreshTokenApi } from '@/api/auth';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
const scCode = import.meta.env.VITE_SC_CODE;

export const errorMessages = {
    201: 'Createe',
    401: '登录过期，请重新登录',
    403: 'Forbidden',
    404: '404 notFound'
};

// 默认获取错误消息的工具函数
export const getErrorMessage = (err: any) => {
    return err?.response?.data?.message ?? err?.message ?? err;
};

/** 刷新期间挂起的请求：刷新成功后按原 config 重放，失败时统一 reject */
interface PendingRequest {
    config: InternalAxiosRequestConfig;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
}

let isRefreshing = false;
const pendingRequests: PendingRequest[] = [];

/** 刷新失败：结算全部挂起请求（splice(0) 取副本并清空,避免边结算边入队被连带丢弃） */
const rejectPending = (reason: unknown): void => {
    pendingRequests.splice(0).forEach((pending) => pending.reject(reason));
};

export const handleUnauthorizedError = async (err: any, instance: AxiosInstance) => {
    /* 登录页的 401（多为账号密码错误）不做 token 刷新,直接 reject 交由调用方处理 */
    if (location.hash.includes('login')) {
        return Promise.reject(err);
    }
    const { config } = err;

    if (isRefreshing) {
        /* 刷新进行中：当前请求挂起,待刷新完成后统一结算 */
        return new Promise((resolve, reject) => {
            pendingRequests.push({ config, resolve, reject });
        });
    }

    isRefreshing = true;
    try {
        const { data } = await refreshTokenApi({
            token: sessionStorage.getItem('token'),
            refreshToken: sessionStorage.getItem('refreshToken')
        });

        if (!scCode.includes(data.code) || !data.data) {
            // 刷新失败（token 或 refreshToken 均无效）：挂起请求一并失败
            rejectPending(err);
            return Promise.reject(err);
        }

        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('refreshToken', data.data.refreshToken);

        pendingRequests.splice(0).forEach((pending) => {
            instance.request(pending.config).then(pending.resolve, pending.reject);
        });

        return instance.request(config);
    } catch (refreshError) {
        rejectPending(refreshError);
        return Promise.reject(refreshError);
    } finally {
        isRefreshing = false;
    }
};
