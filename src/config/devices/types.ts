/**
 * 站点设备数据模型：设备的统一描述,供全局加载器创建地图标牌点位,
 * 各页面按需消费（列表联动 / 点位操作 / 弹窗数据）。
 */

/** 固定枪机测温摄像头状态（4 态） */
export type GunCameraStatus = 'offline' | 'normal' | 'warning' | 'overheat';

/** 球机监控摄像头状态（3 态） */
export type DomeCameraStatus = 'offline' | 'normal' | 'fire';

/** 摄像头设备状态（枪机 4 态 / 球机 3 态） */
export type CameraDeviceStatus = GunCameraStatus | DomeCameraStatus;

/** 摄像头设备 */
export interface CameraDevice {
    /** 设备编号 */
    id: string;
    /** 括注（如 备用变 / SVG / 进出线路） */
    suffix?: string;
    /** 设备类型（展示名） */
    type: string;
    /** 状态 */
    status: CameraDeviceStatus;
    /** 经度（地图标牌创建与列表点击定位共用） */
    lng: number;
    /** 纬度 */
    lat: number;
}

/** 子分组（光伏站的方阵；无标题则平铺） */
export interface CameraSubgroup {
    title?: string;
    items: CameraDevice[];
}

/** 摄像头分组 */
export interface CameraGroup {
    title: string;
    total: number;
    subgroups: CameraSubgroup[];
}

/** 设备类别（弹窗经 entity.properties.type 按此分发） */
export type DeviceKind = 'camera' | 'fiber' | 'nest';

/** 设备类型展示名（站点数据文件共用） */
export const DEVICE_TYPE_GUN = '固定枪机测温摄像头';
export const DEVICE_TYPE_DOME = '球机监控摄像头';

/** 站点设备点位（全局加载器据此创建标牌实体） */
export interface DevicePoint {
    /** 实体名（站点容器内唯一;列表↔点位关联键,生成规则见 cameraMarkerName） */
    id: string;
    /** 设备类别 */
    type: DeviceKind;
    /** 点位标牌文字 */
    text: string;
    lng: number;
    lat: number;
    /** 弹窗数据（各类型弹窗所需字段） */
    data: Record<string, unknown>;
}
