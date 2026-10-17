<template>
  <view class="page">
    <view class="points-header card">
      <text class="points-value">{{ points }}</text>
      <text class="points-label">当前积分</text>
    </view>
    <empty-state text="积分明细功能开发中" icon="🎯" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMemberInfo } from '@/api/member'
import EmptyState from '@/components/empty-state.vue'

const points = ref(0)
onShow(async () => { try { const info = await getMemberInfo(); points.value = info.points || 0 } catch {} })
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-xl; margin-bottom: $spacing-md; text-align: center; box-shadow: $shadow-sm; }
.points-value { font-size: 80rpx; color: $brand-primary; font-weight: 700; display: block; }
.points-label { font-size: $font-sm; color: $text-secondary; margin-top: $spacing-xs; }
</style>
