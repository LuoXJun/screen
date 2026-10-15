/**
 * 视频监控页配置。
 */

import type { LookAtLonLatOptions } from '@/cesium';

/** 列表点击定位时的相机视角（近景点位斜视,标签牌清晰可见） */
export const CAMERA_FOCUS_VIEW: LookAtLonLatOptions = {
    heading: 0,
    pitch: -35,
    range: 460,
    duration: 1.6
};
