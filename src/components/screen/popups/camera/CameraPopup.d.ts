/** 摄像头设备状态 */
export type CameraStatus = 'online' | 'offline';

/** 摄像头弹窗数据 */
export interface CameraData {
    /** 设备编号 */
    no: string;
    /** 厂商型号 */
    model: string;
    /** 安装位置 */
    location: string;
    /** 投运日期 */
    installDate: string;
    /** 当前状态 */
    status: CameraStatus;
    /** 最后告警 */
    lastAlarm: string;
    /** 监控画面（assets/images 下文件名,可选） */
    preview?: string;
}
