<template>
    <basePanelMask>
        <basePanelTitle title="场站信息" />
        <baseCardList :list="list"></baseCardList>
        <basePanelCard>
            <p class="people">应急联系人</p>
            <el-row class="text">
                <el-col :span="12">李站长</el-col>
                <el-col :span="12">138xxxxxxxx</el-col>
                <el-col :span="12">消防队</el-col>
                <el-col :span="12">119/xxxxxxx</el-col>
            </el-row>
        </basePanelCard>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseCardList from '@/components/baseCardList/baseCardList.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import type { BaseCardListItem } from '@/components/baseCardList/baseCardList';

const list = ref<BaseCardListItem[]>(
    new Array(7).fill(1).map((_, index) => {
        return {
            imgName: 'station.png',
            name: '场站名称' + index,
            text: '华电xxxx光伏基地'
        };
    })
);
</script>

<style scoped lang="scss">
.people {
    color: #4a7a9b;
    margin-bottom: base(5px);
}
.text {
    color: #e8f4ff;
    .el-col {
        margin-bottom: base(5px);
    }
    .el-col:last-child {
        color: #e03030;
    }
}
</style>
