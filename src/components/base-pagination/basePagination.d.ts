type PageInfo = {
    pageNum: number;
    pageSize: number;
    total: number;
};
/** EP layout 项与分隔符:'->' 之后的项归组右对齐(total 左、控件组右的布局由此实现) */
type Layout = 'total' | 'sizes' | 'prev' | 'pager' | 'next' | 'jumper' | '->';
