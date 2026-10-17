<template>
  <view class="page">
    <view class="status-card card">
      <text class="status-text">{{ refund.statusText || '处理中' }}</text>
    </view>
    <view class="info-card card">
      <view class="info-row"><text class="label">售后编号</text><text>{{ refund.refundNo }}</text></view>
      <view class="info-row"><text class="label">售后类型</text><text>{{ refund.typeText }}</text></view>
      <view class="info-row"><text class="label">退款金额</text><text class="amount">¥{{ formatPrice(refund.refundAmount) }}</text></view>
      <view class="info-row"><text class="label">退款原因</text><text>{{ refund.reason }}</text></view>
      <view class="info-row" v-if="refund.rejectReason"><text class="label">拒绝原因</text><text class="reject">{{ refund.rejectReason }}</text></view>
      <view class="info-row"><text class="label">申请时间</text><text>{{ formatTime(refund.createTime) }}</text></view>
    </view>
    <view class="action-section" v-if="refund.status === 0">
      <button class="btn-outline" @click="onCancel">取消售后</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { cancelRefund } from '@/api/refund'
import { formatPrice, formatTime } from '@/utils/format'

const refund = ref({})
onLoad((options) => {
  if (options.refund) refund.value = JSON.parse(decodeURIComponent(options.refund))
})

const onCancel = () => {
  uni.showModal({ title: '提示', content: '确定取消售后？', success: async (res) => {
    if (res.confirm) { await cancelRefund(refund.value.id); uni.showToast({ title: '已取消' }); uni.navigateBack() }
  }})
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.status-card { text-align: center; padding: $spacing-xl; }
.status-text { font-size: $font-xl; font-weight: 600; color: $brand-primary; }
.info-row { display: flex; justify-content: space-between; padding: $spacing-sm 0; font-size: $font-sm; border-bottom: 1rpx solid $border-color; &:last-child { border-bottom: none; } }
.label { color: $text-secondary; }
.amount { color: $price-color; font-weight: 600; }
.reject { color: $error-color; }
.action-section { padding: $spacing-md 0; }
.btn-outline { background: transparent; color: $text-secondary; border: 1rpx solid $border-color; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
</style>
