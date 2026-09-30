<template>
    <div class="station-info">
        <basePanelMask class="card-box">
            <basePanelTitle title="场站信息" />
            <baseCardList class="card-list" :list="list"></baseCardList>
            <basePanelCard>
                <p class="people">应急联系人</p>
                <el-row class="text">
                    <el-col :span="8">李站长</el-col>
                    <el-col :span="16">138xxxxxxxx</el-col>
                    <el-col :span="8">消防队</el-col>
                    <el-col :span="16">119 / 139-XXXX-7702</el-col>
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
.station-info {
    min-height: 0;
    display: flex;
    flex-direction: column;
    .people {
        color: #4a7a9b;
        margin-bottom: base(5px);
    }
    .text {
        color: #e8f4ff;
        .el-col {
            margin-bottom: base(5px);
            &:nth-child(2n) {
                text-align: right;
                padding-right: base(4px);
            }
        }
        .el-col:last-child {
            color: #e03030;
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
    }
}
</style>
