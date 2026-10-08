import type { BaseStatListItem } from '@/components/baseStatList/baseStatList';
import type { BaseTabItem } from '@/components/baseTab/baseTab';

/** 无人机巡检指标（设计稿数据，待接接口；icon 为 assets/images 下文件名） */
export const INSPECT_STATS: BaseStatListItem[] = [
    {
        label: '执行任务',
        icon: 'task.svg',
        value: 259,
        unit: '次',
        valueColor: '#21b9f9',
        note: '环比',
        noteType: 'trend'
    },
    {
        label: '光伏组件',
        icon: 'pv-module.svg',
        value: 68,
        unit: '处',
        valueColor: '#19fac5',
        note: '待消缺23处',
        noteType: 'todo'
    },
    {
        label: '架空线路',
        icon: 'overhead-line.svg',
        value: 7,
        unit: '处',
        valueColor: '#21b9f9',
        note: '待消缺8处',
        noteType: 'todo'
    }
];

/** 任务页签 */
export const TASK_TABS: BaseTabItem[] = [
    { label: '最近任务', value: 'recent' },
    { label: '隐患类型构成', value: 'hazard' }
];

/** 任务状态：done=已完成（绿）/ running=执行中（蓝） */
export type TaskStatus = 'done' | 'running';

/** 任务状态文案（配色修饰类定义见 inspection.vue 的 .task-status） */
export const TASK_STATUS_MAP: Record<TaskStatus, string> = {
    done: '已完成',
    running: '执行中'
};

/** 巡检任务项 */
export interface InspectTask {
    /** 任务编号 */
    no: string;
    /** 状态 */
    status: TaskStatus;
    /** 任务名（站点·任务内容） */
    name: string;
    /** 信息行分段（时间/进度、发现数量），渲染以「·」间隔 */
    meta: string[];
}

/** 最近巡检任务（设计稿数据，待接接口） */
export const INSPECT_TASKS: InspectTask[] = [
    {
        no: 'UAT-07B-03',
        status: 'done',
        name: '团箐站·架空线路精扫',
        meta: ['今日12:40', '发现隐患6处']
    },
    {
        no: 'UAT-07B-03',
        status: 'running',
        name: '先锋站·光伏板热斑巡逻',
        meta: ['进度78%', '发现11处']
    },
    {
        no: 'UAT-07B-03',
        status: 'done',
        name: '先锋站·架空线路精扫',
        meta: ['昨日12:40', '发现树障6处']
    }
];

/** 隐患条配色组（见 hazardTypes.vue 的 tone-*；条长由 value/total 计算，各条独立） */
export type HazardTone = 'blue' | 'cyan' | 'purple' | 'orange';

/** 隐患项 */
export interface HazardItem {
    /** 隐患名 */
    name: string;
    /** 数量 */
    value: number;
    /** 条样式组 */
    tone: HazardTone;
}

/** 隐患分组 */
export interface HazardGroup {
    /** 分组名 */
    name: string;
    /** 分组总数 */
    total: number;
    /** 分组内隐患项 */
    items: HazardItem[];
}

/**
 * 隐患类型构成（设计稿数据,待接接口）
 * 各项 value 由设计稿条几何反推（约 1.98px/个）：93/39/27/32px → 47/20/14/16；
 * 设计稿"每项均标 47"为占位残留，此处按条长还原并补齐到总数
 */
export const HAZARD_GROUPS: HazardGroup[] = [
    {
        name: '光伏组件隐患',
        total: 132,
        items: [
            { name: '热斑', value: 100, tone: 'blue' },
            { name: '遮挡', value: 20, tone: 'cyan' },
            { name: '碎裂', value: 14, tone: 'purple' },
            { name: '二级管故障', value: 16, tone: 'orange' },
            { name: '其他', value: 35, tone: 'purple' }
        ]
    },
    {
        name: '架空线路隐患',
        total: 97,
        items: [
            { name: '销钉缺失', value: 47, tone: 'blue' },
            { name: '金具发热', value: 20, tone: 'cyan' },
            { name: '绝缘子玻璃', value: 14, tone: 'purple' },
            { name: '树障', value: 16, tone: 'orange' }
        ]
    }
];
