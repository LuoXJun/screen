import { onBeforeUnmount, onMounted } from 'vue';
import { addEntity, createLabelPinBillboard, flyToLonLat } from '@/cesium';

/** 测试点位（types 对应点击弹窗的注册类型;data 为各类型弹窗所需数据,待接接口） */
interface TestPoint {
    type: 'camera' | 'fiber' | 'nest';
    lng: number;
    lat: number;
    text: string;
    data?: Record<string, unknown>;
}

/**
 * 地图测试点位与初始视角（洪家渡附近近似坐标）：
 * 三类设备各一——摄像头/光纤测温/无人机机巢,点击经 useEntityPopup 分发弹窗
 */
const TEST_POINTS: TestPoint[] = [
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
];

/** 测试区域中心与初始视角高度（米） */
const TEST_VIEW = { lng: 105.9208, lat: 26.8604, height: 3200 };

/** 重建全部测试点位（addEntity 同名替换,无残留） */
async function createTestPoints(): Promise<void> {
    await Promise.all(
        TEST_POINTS.map(async (point, i) => {
            const options = await createLabelPinBillboard(point.lng, point.lat, 0, {
                text: point.text
            });
            addEntity(`test-${point.type}-${i + 1}`, {
                ...options,
                properties: { type: point.type, ...point.data }
            });
        })
    );
}

/**
 * 窗口尺寸变化:标签牌画布按生成时的基准烘焙（尺寸/字号为裸像素）,
 * 须按新基准重建实体
 */
let resizeTimer: number | undefined;

function onResize(): void {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        void createTestPoints();
    }, 200);
}

/** 地图点位初始化与初始视角（挂载时执行） */
export function useMapEntities(): void {
    onMounted(async () => {
        await createTestPoints();
        flyToLonLat(TEST_VIEW.lng, TEST_VIEW.lat, TEST_VIEW.height);
        window.addEventListener('resize', onResize);
    });

    onBeforeUnmount(() => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
    });
}
