/**
 * 视频监控警报中心配置（设计稿 251-1353,样本数据待接接口）。
 */

/** 警报级别 */
export type AlarmLevel = 'urgent' | 'warning' | 'done';

/** 级别 → 卡片色调（CSS 值,经 --card-* 变量注入卡片） */
export interface AlarmTone {
    /** 级别标签文案 */
    label: string;
    /** 卡片底色 / 描边 */
    bg: string;
    border: string;
    /** 标题 / 等级标签色 */
    title: string;
    /** 等级标签底色 / 描边 */
    tagBg: string;
    tagBorder: string;
}

export const ALARM_LEVEL_MAP: Record<AlarmLevel, AlarmTone> = {
    urgent: {
        label: '紧急',
        bg: 'color-mix(in srgb, var(--lxj-color-danger) 10%, transparent)',
        border: 'color-mix(in srgb, var(--lxj-color-danger) 40%, transparent)',
        title: 'var(--lxj-color-danger)',
        tagBg: 'color-mix(in srgb, var(--color-red-500) 20%, transparent)',
        tagBorder: 'color-mix(in srgb, var(--color-red-500) 40%, transparent)'
    },
    warning: {
        label: '警告',
        bg: 'color-mix(in srgb, var(--color-orange-400) 10%, transparent)',
        border: 'color-mix(in srgb, var(--color-orange-400) 40%, transparent)',
        title: 'var(--color-orange-400)',
        tagBg: 'color-mix(in srgb, var(--lxj-color-accent-orange) 15%, transparent)',
        tagBorder: 'color-mix(in srgb, var(--lxj-color-accent-orange) 30%, transparent)'
    },
    done: {
        label: '已处理',
        bg: 'color-mix(in srgb, var(--lxj-color-success) 10%, transparent)',
        border: 'color-mix(in srgb, var(--lxj-color-success) 40%, transparent)',
        title: 'var(--lxj-color-success)',
        tagBg: 'color-mix(in srgb, var(--lxj-color-success) 15%, transparent)',
        tagBorder: 'color-mix(in srgb, var(--lxj-color-success) 30%, transparent)'
    }
};

/** 标题右侧未处理计数（设计稿红字,待接口） */
export const ALARM_UNDONE_TEXT = '7条未处理';

/** 筛选页签（全部 + 三级别） */
export type AlarmTabKey = 'all' | AlarmLevel;

export interface AlarmTab {
    value: AlarmTabKey;
    label: string;
}

export const ALARM_TABS: AlarmTab[] = [
    { value: 'all', label: '全部' },
    { value: 'urgent', label: '紧急' },
    { value: 'warning', label: '警告' },
    { value: 'done', label: '已处理' }
];

/** 统计格（数值色见 color,图标为 assets 文件名） */
export interface AlarmStat {
    key: AlarmLevel;
    label: string;
    value: number;
    icon: string;
    color: string;
}

/** 三格统计（设计稿值） */
export const ALARM_STATS: AlarmStat[] = [
    {
        key: 'urgent',
        label: '紧急',
        value: 259,
        icon: 'alarm-stat-urgent.svg',
        // 设计稿取值：red-500 无对应语义档位
        color: 'var(--color-red-500)'
    },
    {
        key: 'warning',
        label: '警告',
        value: 68,
        icon: 'alarm-stat-warning.svg',
        color: 'var(--lxj-color-accent-orange)'
    },
    {
        key: 'done',
        label: '已处理',
        value: 7,
        icon: 'alarm-stat-done.svg',
        color: 'var(--lxj-color-success)'
    }
];

/** 警报条目（time 为空时无底部时间/操作行——如已处理卡） */
export interface AlarmItem {
    id: string;
    level: AlarmLevel;
    title: string;
    location: string;
    desc: string;
    time?: string;
}

/** 警报列表（设计稿样本,待接口） */
export const ALARM_LIST: AlarmItem[] = [
    {
        id: 'AL-01',
        level: 'urgent',
        title: '光伏区A出现浓烟',
        location: 'CAM-B01 A区·#034列光伏板',
        desc: 'AI检测到有浓烟，疑似有火源，尽快处理',
        time: '14:21:52'
    },
    {
        id: 'AL-02',
        level: 'urgent',
        title: '光伏区A出现浓烟',
        location: 'CAM-B01 A区·#034列光伏板',
        desc: 'AI检测到有浓烟，疑似有火源，尽快处理',
        time: '14:21:52'
    },
    {
        id: 'AL-03',
        level: 'warning',
        title: '东南方边界植被高温异常',
        location: 'CAM-C02 东南角围界',
        desc: '检测到东南方边界有人员活动，有生活火隐患',
        time: '14:19:44'
    },
    {
        id: 'AL-04',
        level: 'warning',
        title: '东南方边界植被高温异常',
        location: 'CAM-C02 东南角围界',
        desc: '检测到东南方边界有人员活动，有生活火隐患',
        time: '14:19:44'
    },
    {
        id: 'AL-05',
        level: 'done',
        title: '设备高线恢复通知',
        location: 'CAM-A03 已复复',
        desc: '✓ 已处理'
    }
];
