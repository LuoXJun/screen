<template>
    <div class="siteSwitch">
        <siteButton
            v-for="site in SITE_LIST"
            :key="site.key"
            :label="site.label"
            :active="site.key === modelValue"
            @click="modelValue = site.key"
        />
    </div>
</template>

<script setup lang="ts">
import siteButton from './siteButton.vue';
import { SITE_LIST, type SiteKey } from './siteSwitch.config';

/** 当前站点（互斥切换;列表数据联动待接口） */
const modelValue = defineModel<SiteKey>({ default: 'xianfeng' });
</script>

<style scoped lang="scss">
.siteSwitch {
    display: flex;
    flex-shrink: 0;
    gap: base(10px);
}
</style>
