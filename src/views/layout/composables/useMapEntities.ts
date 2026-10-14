import { onBeforeUnmount, onMounted } from 'vue';
import { addSiteEntity, clearSiteEntities, createLabelPinBillboard } from '@/cesium';
import type { SiteKey } from '@/config/site';

/** 测试点位（types 对应点击弹窗的注册类型;data 为各类型弹窗所需数据,待接接口） */
interface TestPoint {
    type: 'camera' | 'fiber' | 'nest';
    lng: number;
    lat: number;
    text: string;
    data?: Record<string, unknown>;
}

/**
 * 各站点测试点位（站点附近近似坐标,待实地确认）：
 * 三类设备各一——摄像头/光纤测温/无人机机巢,点击经 useEntityPopup 分发弹窗
 */
const SITE_TEST_POINTS: Record<SiteKey, TestPoint[]> = {
    xianfeng: [
        {
            type: 'camera',
            lng: 105.9202,
            lat: 26.8603,
            text: '摄像头·方阵A-023',
            /* 摄像头弹窗数据（设计稿值） */
            data: {
                no: 'F3Cc79de-2fec54',
                model: 'Fd491',
                location: '先锋站B区4号方阵·逆变器·组串12',
                installDate: '2026-09-22',
                status: 'online',
                lastAlarm: '无',
                preview: 'camera-preview.png'
            }
        },
        {
            type: 'fiber',
            lng: 105.9235,
            lat: 26.8622,
            text: '光纤测温·箱变#12高压侧',
            /* 光纤测温弹窗数据（设计稿值） */
            data: {
                no: 'F3Cc79de-2fec54',
                model: 'Fd491',
                location: '先锋站B区4号方阵·逆变器·组串12',
                installDate: '2026-09-22',
                historyMin: '·在线',
                status: 'online',
                temperature: 62.1,
                tempStatus: 'warning',
                thresholdText: '温度阈值：正常 <70°C · 预警 ≥70°C · 超温 ≥85°C（可配置）',
                trendDates: ['11-12', '11-12', '11-12', '11-12', '11-12', '11-12'],
                trendValues: [500, 470, 620, 440, 1000, 520]
            }
        },
        {
            type: 'nest',
            lng: 105.9168,
            lat: 26.8574,
            text: '无人机机巢·JC-03',
            /* 无人机巢弹窗数据（设计稿值） */
            data: {
                no: 'F3Cc79de-2fec54',
                location: '先锋站B区4号方阵·逆变器·组串12',
                installDate: '2026-09-22',
                status: 'online',
                door: '已关闭',
                doorAlert: true,
                charge: '充电中 78%',
                env: '32°C / 54%',
                weather: '风速 3.2m/s',
                weatherTag: '适飞',
                network: 'online',
                drone: '在位 · 电量 62%',
                taskNo: 'UAT-0715-02',
                taskStatus: '执行中',
                taskProgress: 78
            }
        }
    ],
    tuanqing: [
        {
            type: 'camera',
            lng: 105.8521,
            lat: 26.815,
            text: '摄像头·方阵C-011',
            /* 摄像头弹窗数据（设计稿值,占位待接口） */
            data: {
                no: 'F3Cc79de-2fec55',
                model: 'Fd491',
                location: '团箐站A区2号方阵·逆变器·组串8',
                installDate: '2026-09-25',
                status: 'online',
                lastAlarm: '无',
                preview: 'camera-preview.png'
            }
        },
        {
            type: 'fiber',
            lng: 105.8552,
            lat: 26.817,
            text: '光纤测温·箱变#07高压侧',
            /* 光纤测温弹窗数据（设计稿值,占位待接口） */
            data: {
                no: 'F3Cc79de-2fec55',
                model: 'Fd491',
                location: '团箐站A区2号方阵·逆变器·组串8',
                installDate: '2026-09-25',
                historyMin: '·在线',
                status: 'online',
                temperature: 48.6,
                tempStatus: 'normal',
                thresholdText: '温度阈值：正常 <70°C · 预警 ≥70°C · 超温 ≥85°C（可配置）',
                trendDates: ['11-12', '11-12', '11-12', '11-12', '11-12', '11-12'],
                trendValues: [420, 510, 480, 530, 460, 490]
            }
        },
        {
            type: 'nest',
            lng: 105.8498,
            lat: 26.8129,
            text: '无人机机巢·JC-01',
            /* 无人机巢弹窗数据（设计稿值,占位待接口） */
            data: {
                no: 'F3Cc79de-2fec55',
                location: '团箐站A区2号方阵·逆变器·组串8',
                installDate: '2026-09-25',
                status: 'online',
                door: '已关闭',
                doorAlert: false,
                charge: '待机',
                env: '28°C / 61%',
                weather: '风速 2.1m/s',
                weatherTag: '适飞',
                network: 'online',
                drone: '在位 · 电量 87%',
                taskNo: 'UAT-0715-05',
                taskStatus: '待命',
                taskProgress: 0
            }
        }
    ]
};

/** 已加载站点（避免切换时重复构建;窗口尺寸变化时整体重建） */
const loadedSites = new Set<SiteKey>();

/** 加载站点测试点位到对应容器（已加载则跳过;force 用于重建,如窗口尺寸变化后重烘焙标签牌） */
export async function loadSiteEntities(siteKey: SiteKey, force = false): Promise<void> {
    if (loadedSites.has(siteKey) && !force) return;
    clearSiteEntities(siteKey);
    await Promise.all(
        SITE_TEST_POINTS[siteKey].map(async (point, i) => {
            const options = await createLabelPinBillboard(point.lng, point.lat, 0, {
                text: point.text
            });
            addSiteEntity(siteKey, `${point.type}-${i + 1}`, {
                ...options,
                properties: { type: point.type, ...point.data }
            });
        })
    );
    loadedSites.add(siteKey);
}

/**
 * 窗口尺寸变化:标签牌画布按生成时的基准烘焙（尺寸/字号为裸像素）,
 * 须按新基准重建全部已加载站点的实体
 */
let resizeTimer: number | undefined;

function onResize(): void {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        loadedSites.forEach((siteKey) => {
            loadSiteEntities(siteKey, true).catch((err: unknown) => {
                console.error(`[site] ${siteKey} 站点点位重建失败`, err);
            });
        });
    }, 200);
}

/** 地图站点点位数据源（容器显隐与相机定位由 useSiteSwitch 编排） */
export function useMapEntities(): void {
    onMounted(() => {
        window.addEventListener('resize', onResize);
    });

    onBeforeUnmount(() => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
    });
}
