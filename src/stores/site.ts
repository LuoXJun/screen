import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { DEFAULT_SITE_KEY, SITE_CONFIG_MAP, type SiteKey } from '@/config/site';

/**
 * 全局站点状态：站点的唯一事实来源。
 * 只维护状态，不产生副作用——地图联动见 views/layout/composables/useSiteSwitch，
 * 接口站点参数注入见 Phase 2 请求拦截器，页面取数见 useSiteFetch（待接口）。
 */
export const useSiteStore = defineStore('site', () => {
    /** 当前站点 */
    const activeSite = ref<SiteKey>(DEFAULT_SITE_KEY);

    /** 切换纪元：每次真实切换 +1，用于作废在途的旧站点请求响应 */
    const epoch = ref(0);

    /** 当前站点配置 */
    const activeSiteConfig = computed(() => SITE_CONFIG_MAP[activeSite.value]);

    /** 切换站点（同站点忽略） */
    function switchSite(key: SiteKey): void {
        if (key === activeSite.value) return;
        activeSite.value = key;
        epoch.value += 1;
    }

    return { activeSite, epoch, activeSiteConfig, switchSite };
});
