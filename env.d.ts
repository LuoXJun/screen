/// <reference types="vite/client" />
/// <reference types="element-plus/global" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
    export default component;
}

interface ViteTypeOptions {
    // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
    // 这样就不允许有未知的键值了。
    strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_TIME_OUT: number;
    readonly VITE_API_URL: string;
    readonly VITE_SC_CODE: Array<number | string>;
    readonly VITE_CESIUM_ION_TOKEN?: string;
    /** 司空 2 私有化平台地址 */
    readonly VITE_FH2_API_URL?: string;
    /** 司空 2 组织密钥（JWT），控制台「组织设置 → OpenAPI」复制 */
    readonly VITE_FH2_USER_TOKEN?: string;
    /** 司空 2 项目 UUID */
    readonly VITE_FH2_PROJECT_UUID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
