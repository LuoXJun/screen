<template>
    <div
        class="basePanelHandle"
        :class="{ 'is-collapsed': collapsed }"
        role="button"
        :aria-label="collapsed ? '展开面板' : '收起面板'"
        tabindex="0"
        @click="emit('toggle')"
        @keydown.enter="emit('toggle')"
        @keydown.space.prevent="emit('toggle')"
    >
        <!-- 设计稿:Figma 洪家渡防火灾 · 面板把手(80.15×24, 原图为竖版在 Figma 内旋转放置,此处内化 rotate(-90) 归正) -->
        <svg
            class="handleShape"
            width="81.149"
            height="24.385"
            viewBox="0 0 81.149 24.385"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(0 24.385) rotate(-90)">
                <g>
                    <path
                        class="bodyFill"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 81.1487L0 0L22.8015 21.3443C23.8114 22.2897 24.3845 23.6112 24.3845 24.9946L24.3845 56.0383C24.3845 57.417 23.8153 58.7344 22.8113 59.6793L0 81.1487Z"
                    />
                    <path
                        class="bodyStroke"
                        d="M0.499735 79.9902L22.4685 59.3154C23.372 58.465 23.8845 57.2789 23.8845 56.0381L23.8845 24.9941C23.8844 23.7492 23.3685 22.5597 22.4597 21.709L0.499735 1.15234L0.499735 79.9902Z"
                    />
                </g>
                <g>
                    <path
                        class="bodyFill"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.09425e-06 0.000287785L0 81.149L22.7735 60.1554C23.8004 59.2087 24.3845 57.8758 24.3845 56.4791L24.3845 25.1107C24.3845 23.732 23.8153 22.4146 22.8113 21.4697L7.09425e-06 0.000287785Z"
                    />
                    <path
                        class="bodyStroke"
                        d="M0.499742 1.15875L22.4685 21.8336C23.372 22.684 23.8845 23.8701 23.8845 25.1109L23.8845 56.4791C23.8845 57.7361 23.3585 58.9356 22.4343 59.7877L0.499735 80.0093L0.499742 1.15875Z"
                    />
                </g>
                <g class="handleChevron">
                    <mask :id="chevronMaskId" fill="white">
                        <path d="M14.8025 35.404L9.63249 40.575L14.8025 45.745" />
                    </mask>
                    <path class="bodyFill" d="M14.8025 35.404L9.63249 40.575L14.8025 45.745" />
                    <path
                        class="chevronStroke"
                        d="M9.63249 40.575L8.92531 39.868L8.21834 40.5751L8.92538 41.2821L9.63249 40.575ZM14.8025 35.404L14.0953 34.697L8.92531 39.868L9.63249 40.575L10.3397 41.2821L15.5097 36.111L14.8025 35.404ZM9.63249 40.575L8.92538 41.2821L14.0954 46.4521L14.8025 45.745L15.5096 45.0379L10.3396 39.8679L9.63249 40.575Z"
                        :mask="`url(#${chevronMaskId})`"
                    />
                </g>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
defineProps({
    /** 面板是否已收起(控制 chevron 朝向:展开态朝下如设计稿,收起态翻转朝上) */
    collapsed: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits<{
    toggle: [];
}>();

/* 多实例防串:mask 为文档级 id 引用,须唯一 */
const chevronMaskId = `lxj-panel-handle-mask-${useId()}`;
</script>

<style scoped lang="scss">
/* 设计稿尺寸单一来源:显示尺寸与负偏移共用(base() 须传带单位 sass 值) */
$handle-w: 81.149px;
$handle-h: 24.385px;

.basePanelHandle {
    width: base($handle-w);
    height: base($handle-h);
    cursor: pointer;
    /* 流内负偏移:提到面板顶缘上方居中,底边与面板外缘(border box 顶)齐平(把手骑线)。
       偏移量 = 把手高 + 面板边框宽(1px) + 面板上下内衬(--lxj-panel-space-y,单一数据源
       定义于 basePanelMask,调间距自动跟随);末尾 margin-bottom 回补同值:
       margin box 净占位为 0,后续内容仍从内容区顶开始 */
    margin: calc(-1 * (base($handle-h) + 1px + var(--lxj-panel-space-y))) auto
        calc(1px + var(--lxj-panel-space-y));

    .handleShape {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    /* 把手底/边框:设计稿取值即面板同款令牌(#071428/85% 底 + #00C8FF/30% 描边) */
    .bodyFill {
        fill: var(--lxj-panel-bg);
    }

    .bodyStroke {
        stroke: var(--lxj-color-border-primary-light);
    }

    .handleChevron {
        transform-box: fill-box;
        transform-origin: center;
        transition: transform 0.3s ease;

        .chevronStroke {
            fill: var(--lxj-color-border-primary-light);
            transition: fill 0.2s ease;
        }
    }

    /* 收起:chevron 翻转朝上(点击将展开) */
    &.is-collapsed .handleChevron {
        transform: rotate(180deg);
    }

    /* 悬浮:chevron 提亮(设计稿未出交互样张,按面板交互语言推导) */
    &:hover .handleChevron .chevronStroke {
        fill: color-mix(in srgb, var(--lxj-color-primary) 60%, transparent);
    }

    &:focus-visible {
        outline: 1px solid var(--lxj-color-border-primary);
        outline-offset: 2px;
    }
}
</style>
