<template>
    <div class="basePagination">
        <el-config-provider :locale="paginationLocale">
            <el-pagination
                v-model:current-page="pageInfo.pageNum"
                v-model:page-size="pageInfo.pageSize"
                :class="variant"
                :popper-class="popperClass"
                :page-sizes="pageSizes"
                :size="size"
                :disabled="disabled"
                :background="background"
                :layout="layout.join(',')"
                :total="pageInfo.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-config-provider>
    </div>
</template>

<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/es/utils/index.mjs';
import type { PropType } from 'vue';
import { paginationLocale } from './config';

const emits = defineEmits<{
    handleChange: [type: 'sizeChange' | 'currentChange', value: number];
}>();
const pageInfo = defineModel<PageInfo>({
    default: () => ({
        pageNum: 1,
        pageSize: 10,
        total: 0
    })
});
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    background: {
        type: Boolean,
        default: false
    },
    size: {
        type: String as PropType<
            EpPropMergeType<StringConstructor, '' | 'small' | 'default' | 'large', never>
        >,
        default: 'default'
    },
    pageSizes: {
        type: Array as PropType<number[]>,
        default: () => {
            return [10, 20, 30, 50];
        }
    },
    layout: {
        type: Array as PropType<Layout[]>,
        // EP layout 语法:'->' 分隔左右两端 —— 设计稿:total 靠左、控件组靠右
        default: () => {
            return ['total', '->', 'prev', 'pager', 'next', 'sizes'];
        }
    },
    /** 分页变体类，定义见 styles/elementplus/patch/display/_pagination.scss */
    variant: {
        type: String,
        default: ''
    }
});

/** 下拉面板类名:由变体派生(面板 teleport 至 body,样式经该类名挂钩,见 _pagination.scss) */
const popperClass = computed(() => (props.variant ? `${props.variant}-popper` : ''));

const handleSizeChange = (val: number) => {
    emits('handleChange', 'sizeChange', val);
};
const handleCurrentChange = (val: number) => {
    emits('handleChange', 'currentChange', val);
};
</script>

<style scoped lang="scss">
.basePagination {
    /* el-pagination 撑满整行(补丁层已设 justify-content:flex-end,右对齐不依赖外层收缩) */
    margin-top: base(12px);
}
</style>
