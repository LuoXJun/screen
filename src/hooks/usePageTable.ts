import { reactive, ref, onMounted } from 'vue';
import type { Ref } from 'vue';

/** fetchFn 需要返回的结果结构 */
export interface FetchResult<T> {
    /** 当前页的记录列表 */
    records: T[];
    /** 数据总数（用于分页组件展示） */
    total: number;
}

/** usePageTable 的配置选项 */
export interface UsePageTableOptions {
    /** 初始分页配置，默认 { pageNum: 1, pageSize: 10 } */
    initialPageInfo?: Partial<Omit<PageInfo, 'total'>>;
    /** 是否在 onMounted 时自动请求首页，默认 true */
    immediate?: boolean;
}

/** usePageTable 的返回值 */
export interface UsePageTableReturn<T> {
    /** 分页状态（reactive 对象，分页组件直接 v-model 绑定） */
    pageInfo: PageInfo;
    /** 当前页的记录列表（表格 v-model 绑定） */
    tableData: Ref<T[]>;
    /** 按当前 pageInfo 重新请求 */
    getPage: () => Promise<void>;
    /** 回到首页并重新请求 */
    resetPage: () => Promise<void>;
}

/**
 * 表格 + 分页的组合函数
 *
 * 封装了分页列表页面中反复出现的 pageInfo、tableData、getPage 样板代码。
 * 调用方只需提供一个返回 {@link FetchResult} 的异步函数（入参即当前分页状态），
 * 即可获得完整的翻页能力。
 *
 * fetchFn 以入参而非闭包读取 pageInfo：闭包方案中「解构声明 + 初始化器引用解构变量」
 * 会触发 TS 循环推断（TS7022 implicit any），传参可彻底避免。
 */
export function usePageTable<T>(
    fetchFn: (pageInfo: PageInfo) => Promise<FetchResult<T>>,
    options: UsePageTableOptions = {}
): UsePageTableReturn<T> {
    const pageInfo = reactive<PageInfo>({
        pageNum: options.initialPageInfo?.pageNum ?? 1,
        pageSize: options.initialPageInfo?.pageSize ?? 10,
        total: 0
    });

    // 泛型 T 下 ref() 的 UnwrapRef 推导无法证明与 T[] 等价，按 Vue 官方「ref 泛型标注」写法断言
    const tableData = ref<T[]>([]) as Ref<T[]>;

    const getPage = async () => {
        const { records, total } = await fetchFn(pageInfo);
        tableData.value = records;
        pageInfo.total = total;
    };

    /** 回到首页并重新请求 */
    const resetPage = () => {
        pageInfo.pageNum = 1;
        return getPage();
    };

    if (options.immediate !== false) {
        onMounted(() => {
            getPage();
        });
    }

    return { pageInfo, tableData, getPage, resetPage };
}
