import axios from 'axios';

/**
 * 刷新 token 专用客户端：刻意不挂业务拦截器。
 * 刷新请求由响应拦截器的 401 链路驱动（见 errorCatch）：若复用带拦截器的
 * 业务实例，刷新请求自身返回 401 时会再次进入刷新逻辑，造成死锁。
 */
export const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: import.meta.env.VITE_TIME_OUT
});
