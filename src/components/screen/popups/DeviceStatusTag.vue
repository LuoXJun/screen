<template>
    <span class="deviceStatusTag" :class="`is-${status}`">
        {{ status === 'online' ? '在线' : '离线' }}
    </span>
</template>

<script setup lang="ts">
/** 设备状态标签（弹窗头部附加,经 baseDialog 的 #header-extra 插槽放置） */
defineProps<{
    status: 'online' | 'offline';
}>();
</script>

<style scoped lang="scss">
.deviceStatusTag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: base(62px);
    height: base(28px);
    border-radius: base(3px);
    font-size: font(16px);
    font-weight: var(--lxj-font-weight-Medium);

    /* 设计稿取值:在线绿系 */
    &.is-online {
        color: #37f2a8;
        background: rgba(55, 242, 168, 0.2);
        border: 1px solid #37f2a8;
    }

    &.is-offline {
        color: #e03030;
        background: rgba(224, 48, 48, 0.2);
        border: 1px solid #e03030;
    }
}
</style>
