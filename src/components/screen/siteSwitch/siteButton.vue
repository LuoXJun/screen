<template>
    <div class="siteButton" :class="active ? 'is-active' : 'is-dim'" @click="emits('click')">
        <!-- 底部光晕:宽 → 中 → 核心 -->
        <span class="deco glow-wide"><img :src="glow('wide')" alt="" /></span>
        <span class="deco glow-mid"><img :src="glow('mid')" alt="" /></span>
        <span class="deco glow-core"><img :src="glow('core')" alt="" /></span>
        <!-- 底部亮点 / 顶部光带(仅激活态) -->
        <span v-if="active" class="deco glow-spot">
            <img :src="getImageWidthName(SITE_BTN_DECOS.active.spot)" alt="" />
        </span>
        <span v-if="active" class="deco glow-top">
            <img :src="getImageWidthName(SITE_BTN_DECOS.active.top)" alt="" />
        </span>
        <!-- 两侧竖向光斑 -->
        <span class="deco side-l"><img :src="glow('side')" alt="" /></span>
        <span class="deco side-r"><img :src="glow('side')" alt="" /></span>
        <!-- 文字 -->
        <span class="label">{{ label }}</span>
        <!-- 两侧横线 -->
        <span class="deco line-l">
            <img :src="getImageWidthName(SITE_BTN_DECOS.lineL)" alt="" />
        </span>
        <span class="deco line-r">
            <img :src="getImageWidthName(SITE_BTN_DECOS.lineR)" alt="" />
        </span>
        <!-- 内发光(两态各一套,属性规则优于变量) -->
        <i class="inner-shadow"></i>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import { SITE_BTN_DECOS } from './siteSwitch.config';

const props = defineProps<{
    /** 站点名 */
    label: string;
    /** 是否激活（激活亮蓝光晕 / 未激活暗色） */
    active: boolean;
}>();

const emits = defineEmits<{
    click: [];
}>();

/** 光晕资产按态取用（spot/top 仅激活态存在,单独取） */
function glow(key: 'wide' | 'mid' | 'core' | 'side'): string {
    const set = props.active ? SITE_BTN_DECOS.active : SITE_BTN_DECOS.dim;
    return getImageWidthName(set[key]);
}
</script>

<style scoped lang="scss">
.siteButton {
    position: relative;
    width: base(104px);
    height: base(32px);
    overflow: hidden;
    border-radius: base(3px);
    background: #0b1a2d;
    cursor: pointer;

    &.is-active {
        .label {
            color: var(--color-white);
        }

        .inner-shadow {
            box-shadow:
                inset 0 base(-3px) base(4px) rgba(71, 114, 243, 0.25),
                inset 0 0 base(23.7px) #235ed7;
        }
    }

    &.is-dim {
        .label {
            color: #bbcee5;
        }

        .inner-shadow {
            box-shadow: inset 0 base(-3px) base(4px) rgba(67, 160, 227, 0.25);
        }
    }

    /* 装饰层与设计稿逐层对应(img 的 inset 为 Figma 模糊外扩系数) */
    .deco {
        position: absolute;
        pointer-events: none;

        /* img 不设宽高:由各层 inset 四边定位撑出尺寸（含模糊外扩,同设计稿结构） */
        img {
            position: absolute;
            display: block;
            max-width: none;
        }
    }

    .glow-wide {
        left: 50%;
        bottom: base(-9px);
        width: base(99px);
        height: base(12px);
        transform: translateX(-50%);

        img {
            inset: -102.5% -12.42%;
        }
    }

    .glow-mid {
        left: 50%;
        bottom: base(-9px);
        width: base(65px);
        height: base(12px);
        transform: translateX(-50%);

        img {
            inset: -102.5% -18.92%;
        }
    }

    .glow-core {
        left: 50%;
        bottom: base(-13px);
        width: base(25px);
        height: base(20px);
        transform: translateX(-50%);

        img {
            inset: -88.5% -70.8%;
        }
    }

    .glow-spot {
        left: 50%;
        bottom: base(-3px);
        width: base(11px);
        height: base(5px);
        transform: translateX(-50%);

        img {
            inset: -70% -31.82%;
        }
    }

    .glow-top {
        left: 50%;
        bottom: base(23px);
        width: base(65px);
        height: base(12px);
        transform: translateX(-50%);

        img {
            inset: -102.5% -18.92%;
        }
    }

    .side-l {
        left: base(-6px);
        top: 50%;
        width: base(9px);
        height: base(18px);
        transform: translateY(-50%);

        img {
            inset: -32.22% -64.44%;
        }
    }

    .side-r {
        left: base(98px);
        top: 50%;
        width: base(9px);
        height: base(18px);
        transform: translateY(-50%);

        img {
            inset: -32.22% -64.44%;
        }
    }

    .line-l {
        left: 0;
        top: 50%;
        width: base(17px);
        height: 0;
        transform: translateY(-50%);

        img {
            inset: -1.5px -5.88%;
        }
    }

    .line-r {
        right: base(-1px);
        top: 50%;
        width: base(17px);
        height: 0;
        transform: translateY(-50%);

        img {
            inset: -1.5px -5.88%;
            /* 设计稿:右侧线为镜像渲染(-scale-y-100 + rotate180 净 = 水平翻转) */
            transform: scaleX(-1);
        }
    }

    .label {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: font(16px);
        letter-spacing: base(0.48px);
        line-height: 1;
        white-space: nowrap;
    }

    .inner-shadow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
    }
}
</style>
