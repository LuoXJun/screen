<template>
    <div class="eq-overview">
        <basePanelMask class="card-box">
            <basePanelTitle title="设备总览">
                <p class="num">
                    <span>132</span>
                    台设备在线
                </p>
            </basePanelTitle>
            <baseCardList class="card-list" :list="list"></baseCardList>
            <basePanelCard>
                <p class="people">
                    <span>消防设备整体在线率</span>
                    <span class="ratio">30%</span>
                </p>
                <el-row class="progress">
                    <el-col style="flex: 30% 0 0"></el-col>
                </el-row>
            </basePanelCard>
        </basePanelMask>
    </div>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseCardList from '@/components/baseCardList/baseCardList.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import type { BaseCardListItem } from '@/components/baseCardList/baseCardList';

const list = ref<BaseCardListItem[]>(
    new Array(16).fill(1).map((_, index) => {
        return {
            imgName: 'station.png',
            name: '场站名称' + index,
            text: '华电xxxx光伏基地'
        };
    })
);
</script>

<style scoped lang="scss">
.eq-overview {
    min-height: 0;
    display: flex;
    flex-direction: column;
    .people {
        color: #4a7a9b;
        margin-bottom: base(5px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ratio {
            font-weight: var(--lxj-font-weight-Semibold);
            color: var(--lxj-color-success);
        }
    }
    .progress {
        background: rgba(255, 255, 255, 0.1);
        height: base(4px);
        border-radius: var(--lxj-radius-small);
        .el-col {
            border-radius: var(--lxj-radius-small);
            background: linear-gradient(90deg, #00c8ff 0%, #00e080 100%);
            box-shadow: 0 0 6px 0 rgba(0, 224, 128, 0.5);
        }
    }
    .card-box {
        display: flex;
        flex-direction: column;
        min-height: 0;
        .card-list {
            flex: 1;
            min-height: 0;
            overflow: auto;
        }
        .num {
            color: #aacdf3;
            font-family: var(--lxj-font-family);
            font-weight: var(--lxj-font-weight-Medium);
            font-size: var(--lxj-font-desc);
            > span {
                font-family: var(--lxj-font-family-num);
                font-weight: var(--lxj-font-weight-bold);
                font-size: var(--lxj-font-section);

                // 字体渐变
                display: inline-block;
                /* 从上到下：白 → 绿 */
                background-image: linear-gradient(to bottom, #ffffff 0%, #00feed 100%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent; /* 标准写法 */
                -webkit-text-fill-color: transparent; /* Safari / 旧版 Chrome 兼容 */
            }
        }
    }
}
</style>
