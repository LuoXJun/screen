/**
 * 大屏菜单树（落地自 docs/菜单.json，单一事实来源）。
 * 路由由本文件生成（见 index.ts），菜单组件再从生成结果的路由 meta.title 派生。
 * name 即页面目录名：src/views/pages/<分类 name>/<叶子 name>/index.vue，改动须同步目录。
 */

interface MenuLeaf {
    /** 路由 name，同时是页面目录名 */
    name: string;
    /** 菜单显示文案 */
    title: string;
}

export interface MenuCategory extends MenuLeaf {
    children: MenuLeaf[];
}

export const menuTree: MenuCategory[] = [
    {
        name: 'threeDAnalysis',
        title: '三维分析大屏',
        children: [
            { name: 'overview', title: '总览大屏' },
            { name: 'videoMonitor', title: '监控视频' },
            { name: 'droneRoute', title: '无人机巡检路线' },
            { name: 'vegetationHazard', title: '植被隐患' },
            { name: 'boxTransformerTemp', title: '箱变测温' },
            { name: 'boosterStationTemp', title: '升压站测温' },
            { name: 'hazardAbnormal', title: '隐患异常' },
            { name: 'fireWarning', title: '火灾警示' }
        ]
    },
    {
        name: 'dataMonitor',
        title: '数据监控',
        children: [
            { name: 'fiberTemp', title: '光纤测温' },
            { name: 'infraredTemp', title: '红外测温' },
            { name: 'fireDetect', title: '火灾检测' },
            { name: 'droneStatus', title: '无人机状态' },
            { name: 'nestStatus', title: '机巢状态' },
            { name: 'onlineStatus', title: '设备在线状态' },
            { name: 'faultStatus', title: '设备故障状态' },
            { name: 'historyQuery', title: '历史数据查询' }
        ]
    },
    {
        name: 'dataOperation',
        title: '数据运营',
        children: [
            { name: 'alarmRecord', title: '告警记录' },
            { name: 'alarmHandle', title: '告警处理' },
            { name: 'statisticsReport', title: '统计报表' },
            { name: 'decisionSupport', title: '辅助决策' },
            { name: 'dataAnalysis', title: '数据分析' },
            { name: 'techPolicy', title: '技术制度' },
            { name: 'eArchive', title: '电子档案' }
        ]
    },
    {
        name: 'droneInspection',
        title: '无人机巡检系统',
        children: [
            { name: 'stationModeling', title: '场站建模' },
            { name: 'pvCollection', title: '光伏板数据采集' },
            { name: 'lineCollection', title: '架空线路数据采集' },
            { name: 'routePlanning', title: '巡检航线规划' },
            { name: 'warningDetect', title: '预警识别' },
            { name: 'warningLocate', title: '预警定位' },
            { name: 'warningReport', title: '预警报告生成' }
        ]
    }
];
