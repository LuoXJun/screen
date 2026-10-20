/** 无人机巢弹窗数据 */
export interface NestData {
    /** 机巢编号 */
    no: string;
    /** 安装位置 */
    location: string;
    /** 投运日期 */
    installDate: string;
    /** 设备在线状态（头部标签 + 信息区当前状态） */
    status: 'online' | 'offline';
    /** 舱门状态（如「已关闭」） */
    door: string;
    /** 舱门告警（红点） */
    doorAlert?: boolean;
    /** 充电状态（如「充电中 78%」） */
    charge: string;
    /** 环境温湿度（如「32°C / 54%」） */
    env: string;
    /** 气象站（如「风速 3.2m/s」） */
    weather: string;
    /** 气象提示（如「适飞」） */
    weatherTag: string;
    /** 网络状态 */
    network: 'online' | 'offline';
    /** 舱内无人机（如「在位 · 电量 62%」） */
    drone: string;
    /** 当前任务编号 */
    taskNo: string;
    /** 当前任务状态（如「执行中」） */
    taskStatus: string;
    /** 任务进度（%） */
    taskProgress: number;
}
