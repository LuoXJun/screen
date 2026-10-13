import zhCn from 'element-plus/es/locale/lang/zh-cn';
import type { Language } from 'element-plus/es/locale';

/**
 * 分页文案覆盖（设计稿口径）:
 * - total:  「共计 {total} 条」（EP 默认「共 {total} 条」）
 * - pagesize:「 / 页」（EP 默认「条/页」，与页码拼接为「10 / 页」）
 */
export const paginationLocale: Language = {
    ...zhCn,
    el: {
        ...zhCn.el,
        pagination: {
            ...zhCn.el.pagination,
            total: '共计 {total} 条',
            pagesize: ' / 页'
        }
    }
};
