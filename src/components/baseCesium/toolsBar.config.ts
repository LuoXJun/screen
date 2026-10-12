import type { GeometryType } from '@/cesium';

/** 工具条动作（非绘制指令） */
export type ToolAction = 'reset' | 'clear';

export type ToolType = GeometryType | ToolAction;

export interface ToolItem {
    /** 悬浮提示文案 */
    label: string;
    type: ToolType;
    /** 图标文件（assets/images 下文件名）；缺省时以占位块展示 */
    icon?: string;
}

/** 绘制工具条配置 */
export const TOOLS: ToolItem[] = [
    { label: '重置视角', type: 'reset' },
    { label: '点', type: 'point' },
    { label: '线', type: 'line' },
    { label: '矩形', type: 'rectangle' },
    { label: '多边形', type: 'polygon' },
    { label: '清除', type: 'clear' }
];
