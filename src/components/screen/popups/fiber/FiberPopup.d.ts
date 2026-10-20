/** 温度状态：正常 / 预警 / 超温 */
export type FiberTempStatus = 'normal' | 'warning' | 'overheat';

/** 光纤测温弹窗数据 */
export interface FiberData {
    /** 装置编号 */
    no: string;
    /** 厂商型号 */
    model: string;
    /** 安装位置 */
    location: string;
    /** 投运日期 */
    installDate: string;
    /** 历史最低（展示值） */
    historyMin: string;
    /** 设备在线状态（头部标签） */
    status: 'online' | 'offline';
    /** 当前温度（°C） */
    temperature: number;
    /** 温度状态 */
    tempStatus: FiberTempStatus;
    /** 温度阈值说明（设计稿原文,可配置） */
    thresholdText: string;
    /** 趋势横轴（日期） */
    trendDates: string[];
    /** 趋势序列（与 trendDates 对应） */
    trendValues: number[];
}
