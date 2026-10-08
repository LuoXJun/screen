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
        alarmNo: 'ALM-20250617-015',
        alarmTime: '06-17 10:41',
        monitorPoint: '摄像头 / 方阵A-023',
        content: '设备掉线 5 分钟',
        level: 'hint',
        status: 'done'
    },
    {
        alarmNo: 'ALM-20250616-008',
        alarmTime: '06-16 09:12',
        monitorPoint: '机巢 / JC-03',
        content: '环境湿度 92%（上限 90%）',
        level: 'hint',
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
