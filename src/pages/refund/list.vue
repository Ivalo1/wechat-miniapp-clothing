<template>
  <view class="page">
    <view v-for="item in refunds" :key="item.id" class="refund-card card" @click="goDetail(item)">
      <view class="card-header">
        <text class="refund-no">{{ item.refundNo }}</text>
        <text class="refund-status">{{ item.statusText }}</text>
      </view>
      <view class="card-body">
        <text class="refund-type">{{ item.typeText }}</text>
        <text class="refund-amount">¥{{ formatPrice(item.refundAmount) }}</text>
      </view>
      <view class="card-footer">
        <text class="refund-time">{{ formatTime(item.createTime) }}</text>
      </view>
    </view>
    <empty-state v-if="!refunds.length" text="暂无售后记录" icon="🔄" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRefundList } from '@/api/refund'
import { formatPrice, formatTime } from '@/utils/format'
import EmptyState from '@/components/empty-state.vue'

const refunds = ref([])
onMounted(async () => { try { refunds.value = await getRefundList() } catch {} })
const goDetail = (item) => { uni.navigateTo({ url: `/pages/refund/detail?id=${item.id}` }) }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-sm; box-shadow: $shadow-sm; }
.card-header { display: flex; justify-content: space-between; margin-bottom: $spacing-sm; }
.refund-no { font-size: $font-sm; color: $text-secondary; }
.refund-status { font-size: $font-sm; color: $brand-primary; font-weight: 500; }
.card-body { display: flex; justify-content: space-between; align-items: center; }
.refund-type { font-size: $font-md; color: $text-primary; }
.refund-amount { font-size: $font-lg; color: $price-color; font-weight: 600; }
.card-footer { margin-top: $spacing-sm; }
.refund-time { font-size: $font-xs; color: $text-placeholder; }
</style>
