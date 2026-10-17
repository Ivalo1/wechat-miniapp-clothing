<template>
  <view class="page">
    <empty-state text="收藏功能即将上线" icon="❤️" />
  </view>
</template>

<script setup>
import EmptyState from '@/components/empty-state.vue'
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; display: flex; align-items: center; justify-content: center; }
</style>
