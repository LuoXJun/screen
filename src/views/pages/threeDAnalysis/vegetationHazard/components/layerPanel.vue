<template>
    <basePanelMask class="layer-panel">
        <basePanelTitle class="panel-title" title="图层管理">
            <span class="panel-extra">共 {{ totalLayers }} 层</span>
        </basePanelTitle>

        <div class="layer-groups">
            <section v-for="group in LAYER_GROUPS" :key="group.title" class="layer-group">
                <h3 class="group-title">{{ group.title }}</h3>
                <el-checkbox-group v-model="checked" class="group-options">
                    <el-checkbox
                        v-for="option in group.options"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </el-checkbox>
                </el-checkbox-group>
            </section>
        </div>

        <div class="layer-footer">
            <span class="footer-tip">勾选控制底图图层</span>
            <el-button class="layer-action" @click="selectAll">全选</el-button>
            <el-button class="layer-action" @click="clearAll">清空</el-button>
            <el-button class="layer-action is-default" @click="resetDefault">默认</el-button>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import { setLayerVisible } from '@/cesium';
import { ALL_LAYER_VALUES, DEFAULT_CHECKED_LAYERS, LAYER_GROUPS } from '../config';

/** 已勾选图层（初值还原设计稿） */
const checked = ref<string[]>([...DEFAULT_CHECKED_LAYERS]);

/** 图层总数（设计稿「共 11 层」） */
const totalLayers = ALL_LAYER_VALUES.length;

/* 勾选变化即联动地图图层显隐；未注册图层静默跳过 */
watch(
    checked,
    (values) => {
        ALL_LAYER_VALUES.forEach((value) => {
            setLayerVisible(value, values.includes(value));
        });
    },
    { immediate: true }
);

function selectAll(): void {
    checked.value = [...ALL_LAYER_VALUES];
}

function clearAll(): void {
    checked.value = [];
}

function resetDefault(): void {
    checked.value = [...DEFAULT_CHECKED_LAYERS];
}
</script>

<style scoped lang="scss">
.layer-panel {
    /* 设计稿：面板无上下内衬，左右 10px；分组与页脚自带间距 */
    --lxj-panel-space-y: #{base(6px)};
    --lxj-space-panel: #{base(10px)};

    /* 溢出链同监控视频：标题/页脚固定，分组区收缩并滚动 */
    display: flex;
    flex-direction: column;

    .panel-title {
        flex-shrink: 0;
        margin: base(2px) 0 base(8px);
        border-bottom: 1px solid var(--lxj-color-border-divider);
    }

    .panel-extra {
        padding: base(2px) base(8px);
        border: 1px solid var(--lxj-color-border-divider);
        border-radius: base(4px);
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }
}

.layer-groups {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: base(4px);
    overflow-y: auto;
}

.layer-group {
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);
}

.group-title {
    padding-bottom: base(8px);
    border-bottom: 1px solid var(--lxj-color-border-divider-soft);
    color: var(--lxj-color-text-desc);
    font-size: font(16px);
    font-weight: var(--lxj-font-weight-Semibold);
    line-height: base(22px);
}

.group-options {
    display: flex;
    flex-direction: column;
    padding-top: base(6px);

    :deep(.el-checkbox) {
        height: base(34px);
        margin-right: 0;
        --el-checkbox-input-width: #{base(14px)};
        --el-checkbox-input-height: #{base(14px)};
        --el-checkbox-border-radius: #{base(2px)};
        --el-checkbox-bg-color: var(--lxj-color-text-desc);
        /* 设计稿取值:未选中描边/选中蓝（无对应语义色，按原值保留） */
        --el-checkbox-input-border: 1px solid #767676;
        --el-checkbox-text-color: var(--lxj-color-text-primary);
        --el-checkbox-font-size: #{font(16px)};
        --el-checkbox-font-weight: var(--lxj-font-weight);
        --el-checkbox-checked-bg-color: #159bea;
        --el-checkbox-checked-input-border-color: #159bea;
        --el-checkbox-checked-text-color: var(--lxj-color-text-primary);
        --el-checkbox-checked-icon-color: var(--lxj-color-text-desc);
    }

    :deep(.el-checkbox__label) {
        padding-left: base(10px);
    }
}

.layer-footer {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: base(7px);
    height: base(44px);

    .footer-tip {
        flex: 1;
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }

    .layer-action {
        height: base(31px);
        margin-left: 0;
        padding: 0 base(11px);
        border: 1px solid var(--lxj-color-border-primary-light);
        border-radius: base(3px);
        background: color-mix(in srgb, var(--lxj-color-primary) 6%, transparent);
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);

        &:hover,
        &:focus {
            border-color: var(--lxj-color-border-primary-light);
            background: color-mix(in srgb, var(--lxj-color-primary) 12%, transparent);
            color: var(--lxj-color-text-desc);
        }

        &.is-default {
            /* 设计稿取值:默认按钮蓝（无对应语义色，按原值保留） */
            background: #078edb;
            color: var(--lxj-color-text-desc);

            &:hover,
            &:focus {
                background: color-mix(in srgb, #078edb 85%, var(--color-white));
                color: var(--lxj-color-text-desc);
            }
        }
    }
}
</style>
