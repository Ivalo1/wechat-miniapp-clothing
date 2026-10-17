<template>
  <view class="page">
    <view class="logistics-header card">
      <text class="company">{{ logistics.company || '物流公司' }}</text>
      <text class="tracking-no">运单号: {{ logistics.trackingNo || '-' }}</text>
    </view>
    <view class="timeline card" v-if="logistics.traces?.length">
      <view v-for="(trace, idx) in logistics.traces" :key="idx" class="timeline-item" :class="{ latest: idx === 0 }">
        <view class="timeline-dot"></view>
        <view class="timeline-line" v-if="idx < logistics.traces.length - 1"></view>
        <view class="timeline-content">
          <text class="trace-desc">{{ trace.description }}</text>
          <text class="trace-time">{{ trace.time }}</text>
        </view>
      </view>
    </view>
    <empty-state v-else text="暂无物流信息" icon="📦" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { queryLogistics } from '@/api/logistics'
import EmptyState from '@/components/empty-state.vue'

const logistics = ref({ traces: [] })

onLoad(async (options) => {
  const { orderNo, company, trackingNo } = options
  if (company && trackingNo) {
    try { logistics.value = await queryLogistics(orderNo, company, trackingNo) } catch {}
  }
})
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.logistics-header { }
.company { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; }
.tracking-no { font-size: $font-sm; color: $text-secondary; margin-top: $spacing-xs; }
.timeline-item { display: flex; gap: $spacing-md; position: relative; padding-bottom: $spacing-lg; &:last-child { padding-bottom: 0; } }
.timeline-dot { width: 16rpx; height: 16rpx; border-radius: 50%; background: $border-color; margin-top: 8rpx; flex-shrink: 0; z-index: 1;
  .latest & { background: $brand-primary; width: 20rpx; height: 20rpx; } }
.timeline-line { position: absolute; left: 7rpx; top: 28rpx; bottom: 0; width: 2rpx; background: $border-color; }
.timeline-content { flex: 1; }
.trace-desc { font-size: $font-sm; color: $text-primary; display: block; line-height: 1.5;
  .latest & { color: $brand-primary; font-weight: 500; } }
.trace-time { font-size: $font-xs; color: $text-placeholder; margin-top: $spacing-xs; }
</style>
