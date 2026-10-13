/** 告警等级：紧急 / 一般 / 提示 */
export type AlarmLevel = 'urgent' | 'normal' | 'hint';

/** 处置状态：未处置 / 处置中 / 处置完成 */
export type HandleStatus = 'pending' | 'handling' | 'done';

export interface AlarmRecord {
    /** 告警编号 */
    alarmNo: string;
    /** 告警时间（MM-DD HH:mm） */
    alarmTime: string;
    /** 监测项 / 测点 */
    monitorPoint: string;
    /** 告警内容 */
    content: string;
    /** 等级 */
    level: AlarmLevel;
    /** 处置状态 */
    status: HandleStatus;
}

/** 等级 → 标签文案 + 配色修饰类（类名定义见 styles/elementplus/patch/display/_table.scss 的 .cell-tag） */
export const LEVEL_MAP: Record<AlarmLevel, { label: string; className: string }> = {
    urgent: { label: '紧急', className: 'is-urgent' },
    /* 设计稿未出样张，取色暂用 orange-500，待设计确认后校准 */
    normal: { label: '一般', className: 'is-normal' },
    hint: { label: '提示', className: 'is-hint' }
};

/** 处置状态 → 文案 + 配色修饰类（类名定义见 _table.scss 的 .cell-status） */
export const STATUS_MAP: Record<HandleStatus, { label: string; className: string }> = {
    pending: { label: '未处置', className: 'is-pending' },
    handling: { label: '处置中', className: 'is-handling' },
    done: { label: '处置完成', className: 'is-done' }
};

/** 预警记录列表（设计稿数据，待接接口） */
export const RECORD_LIST: AlarmRecord[] = [
    {
        alarmNo: 'ALM-20250618-001',
        alarmTime: '06-18 14:32',
        monitorPoint: '光纤测温 / 箱变#12高压侧',
        content: '温度 96.2℃（上限 85℃）',
        level: 'normal',
        status: 'pending'
    },
    {
        alarmNo: 'ALM-20250618-002',
        alarmTime: '06-18 13:05',
        monitorPoint: '红外测温 / 升压站1#主变',
        content: '温度 78.4℃（上限 75℃）',
        level: 'urgent',
        status: 'handling'
    },
    {
        alarmNo: 'ALM-20250617-015',
        alarmTime: '06-17 10:41',
        monitorPoint: '摄像头 / 方阵A-023',
        content: '设备掉线 5 分钟',
        level: 'hint',
        status: 'done'
    },
    {
        alarmNo: 'ALM-20250617-011',
        alarmTime: '06-17 08:26',
        monitorPoint: '红外测温 / 箱变#09低压侧',
        content: '温度 79.1℃（上限 75℃）',
        level: 'normal',
        status: 'done'
    },
    {
        alarmNo: 'ALM-20250616-008',
        alarmTime: '06-16 09:12',
        monitorPoint: '机巢 / JC-03',
        content: '环境湿度 92%（上限 90%）',
        level: 'hint',
        status: 'pending'
    },
    {
        alarmNo: 'ALM-20250616-004',
        alarmTime: '06-16 08:47',
        monitorPoint: '光纤测温 / 箱变#07低压侧',
        content: '温升 +2.1℃/min（上限 2.0℃/min）',
        level: 'normal',
        status: 'handling'
    },
    {
        alarmNo: 'ALM-20250615-011',
        alarmTime: '06-15 21:33',
        monitorPoint: '红外测温 / 升压站2#主变',
        content: '温度 82.7℃（上限 75℃）',
        level: 'urgent',
        status: 'pending'
    },
    {
        alarmNo: 'ALM-20250615-006',
        alarmTime: '06-15 16:20',
        monitorPoint: '无人机 / WR-02 巡检航线',
        content: '航线偏离 12m',
        level: 'hint',
        status: 'done'
    },
    {
        alarmNo: 'ALM-20250615-002',
        alarmTime: '06-15 09:58',
        monitorPoint: '机巢 / JC-01',
        content: '舱门开合异常',
        level: 'normal',
        status: 'handling'
    },
    {
        alarmNo: 'ALM-20250614-009',
        alarmTime: '06-14 19:44',
        monitorPoint: '摄像头 / 方阵C-011',
        content: '画面遮挡',
        level: 'hint',
        status: 'pending'
    },
    {
        alarmNo: 'ALM-20250614-003',
        alarmTime: '06-14 11:26',
        monitorPoint: '光纤测温 / 光伏阵列#3 电缆沟',
        content: '温度 91.5℃（上限 85℃）',
        level: 'urgent',
        status: 'done'
    },
    {
        alarmNo: 'ALM-20250613-007',
        alarmTime: '06-13 15:12',
        monitorPoint: '红外测温 / 箱变#12高压侧',
        content: '温度 77.9℃（上限 75℃）',
        level: 'normal',
        status: 'pending'
    }
];

/** 表格列配置（宽度取设计稿；编号/测点/内容为弹性列，用 minWidth 吸收余量） */
export const TABLE_COLUMNS: ITableColumn[] = [
    { filed: 'alarmNo', label: '告警编号', options: { minWidth: 120 } },
    { filed: 'alarmTime', label: '告警时间' },
    { filed: 'monitorPoint', label: '监测项 / 测点', options: { minWidth: 140 } },
    { filed: 'content', label: '告警内容', options: { minWidth: 150 } },
    { filed: 'level', label: '等级' },
    { filed: 'status', label: '处置状态' },
    {
        filed: 'operation',
        label: '操作',
        operations: [
            { type: 'view', label: '详情', link: true },
            { type: 'handle', label: '处理', link: true, className: 'op-minor' }
        ]
    }
];
