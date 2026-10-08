<template>
    <div class="popup-info">
        <p>经度：{{ lonlat.lng.toFixed(6) }}</p>
        <p>纬度：{{ lonlat.lat.toFixed(6) }}</p>
        <p>高度：{{ lonlat.height.toFixed(1) }} 米</p>
    </div>
</template>

<script setup lang="ts">
/** 弹窗内容演示组件：由 showMapPopup 以 h(PopupInfo, { lonlat }) 形式传入 */
defineProps<{ lonlat: { lng: number; lat: number; height: number } }>();
</script>

<style scoped lang="scss">
.popup-info {
    font-size: font(16px);
    /* 浅色卡内文字：与 basePanel 白底配套，独立于深色令牌体系 */
    color: #000;
    line-height: 2;

    p {
        margin: 0;
    }
}
</style>
