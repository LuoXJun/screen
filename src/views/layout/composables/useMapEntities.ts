import { onMounted } from 'vue';
import { addEntity, createLabelPinBillboard, flyToLonLat } from '@/cesium';

/**
 * 地图测试点位与初始视角（洪家渡附近近似坐标）
 * 接入正式数据后由接口下发替换
 */
const TEST_POINTS = [
    { lng: 105.9202, lat: 26.8603, text: '光纤测温·箱变#12高压侧' },
    { lng: 105.9235, lat: 26.8622, text: '红外测温·升压站1#主变' },
    { lng: 105.9168, lat: 26.8574, text: '摄像头·方阵A-023' },
    { lng: 105.9258, lat: 26.8556, text: '机巢·JC-03' }
];

/** 测试区域中心与初始视角高度（米） */
const TEST_VIEW = { lng: 105.9212, lat: 26.859, height: 4200 };

/** 地图点位初始化与初始视角（挂载时执行） */
export function useMapEntities(): void {
    onMounted(async () => {
        await Promise.all(
            TEST_POINTS.map(async (point, i) => {
                const options = await createLabelPinBillboard(point.lng, point.lat, 0, {
                    text: point.text
                });
                addEntity(`test-device-${i + 1}`, options);
            })
        );
        flyToLonLat(TEST_VIEW.lng, TEST_VIEW.lat, TEST_VIEW.height);
    });
}
