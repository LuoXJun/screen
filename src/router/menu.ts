/**
 * 大屏菜单树（与设计稿对齐：3 分类 21 项，单一事实来源）。
 * 路由由本文件生成（见 index.ts），菜单组件再从生成结果的路由 meta.title 派生。
 * name 即页面目录名：src/views/pages/<分类 name>/<叶子 name>/index.vue，改动须同步目录。
 */

interface MenuLeaf {
    /** 路由 name，同时是页面目录名 */
    name: string;
    /** 菜单显示文案 */
    title: string;
    /** 菜单图标（assets/images 下文件名） */
    icon?: string;
}

export interface MenuCategory extends MenuLeaf {
    children: MenuLeaf[];
}

export const menuTree: MenuCategory[] = [
    {
        name: 'threeDAnalysis',
        title: '三维分析大屏',
        icon: 'menu-threeDAnalysis.svg',
        children: [
            { name: 'overview', title: '总览大屏', icon: 'menu-overview.svg' },
            { name: 'videoMonitor', title: '监控视频', icon: 'menu-videoMonitor.svg' },
            { name: 'droneRoute', title: '无人机巡检路线', icon: 'menu-droneRoute.svg' },
            { name: 'vegetationHazard', title: '植被隐患', icon: 'menu-vegetationHazard.svg' },
            {
                name: 'boxTransformerTemp',
                title: '箱变测温',
                icon: 'menu-boxTransformerTemp.svg'
            },
            {
                name: 'boosterStationTemp',
                title: '升压站测温',
                icon: 'menu-boosterStationTemp.svg'
            },
            { name: 'hazardAbnormal', title: '隐患异常', icon: 'menu-hazardAbnormal.svg' },
            { name: 'fireWarning', title: '火灾警示', icon: 'menu-fireWarning.svg' }
        ]
    },
    {
        name: 'dataMonitor',
        title: '数据监控',
        icon: 'menu-dataMonitor.svg',
        children: [
            { name: 'fiberTemp', title: '光纤测温', icon: 'menu-fiberTemp.svg' },
            { name: 'infraredTemp', title: '红外测温', icon: 'menu-infraredTemp.svg' },
            { name: 'fireDetect', title: '摄像头火灾监测', icon: 'menu-fireDetect.svg' },
            { name: 'droneStatus', title: '无人机状态', icon: 'menu-droneStatus.svg' },
            { name: 'nestStatus', title: '机巢状态', icon: 'menu-nestStatus.svg' },
            { name: 'onlineStatus', title: '设备在线状态', icon: 'menu-onlineStatus.svg' },
            { name: 'faultStatus', title: '设备故障状态', icon: 'menu-faultStatus.svg' },
            { name: 'historyQuery', title: '历史数据查询', icon: 'menu-historyQuery.svg' }
        ]
    },
    {
        name: 'dataOperation',
        title: '数据运营',
        icon: 'menu-dataOperation.svg',
        children: [
            { name: 'alarmRecord', title: '告警记录', icon: 'menu-alarmRecord.svg' },
            { name: 'alarmHandle', title: '告警处理', icon: 'menu-alarmHandle.svg' },
            { name: 'statisticsReport', title: '统计报表', icon: 'menu-statisticsReport.svg' },
            {
                name: 'droneInspectionPlan',
                title: '无人机巡检计划',
                icon: 'menu-droneInspectionPlan.svg'
            },
            { name: 'decisionSupport', title: '辅助决策', icon: 'menu-decisionSupport.svg' }
        ]
    }
];
