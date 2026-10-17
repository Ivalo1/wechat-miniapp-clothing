<template>
  <view class="coupon-card" :class="{ used: coupon.status === 1, expired: coupon.status === 2 }">
    <view class="coupon-left">
      <view v-if="coupon.type === 1" class="coupon-amount">
        <text class="amount-symbol">¥</text>
        <text class="amount-value">{{ coupon.discountAmount }}</text>
      </view>
      <view v-else class="coupon-amount">
        <text class="amount-value">{{ (coupon.discountRate * 10).toFixed(1) }}</text>
        <text class="amount-unit">折</text>
      </view>
      <text class="coupon-condition">满{{ coupon.minAmount }}可用</text>
    </view>
    <view class="coupon-right">
      <text class="coupon-name">{{ coupon.name }}</text>
      <text class="coupon-expire">{{ formatDate(coupon.expireTime) }}</text>
    </view>
    <view class="coupon-action" v-if="showAction">
      <text class="btn-receive" @click.stop="$emit('receive')">领取</text>
    </view>
  </view>
</template>

<script setup>
import { formatDate } from '@/utils/format'

defineProps({
  coupon: { type: Object, required: true },
  showAction: { type: Boolean, default: false }
})
defineEmits(['receive'])
</script>

<style lang="scss" scoped>
.coupon-card {
  display: flex; align-items: center;
  background: $bg-card; border-radius: $radius-lg;
  padding: $spacing-md; margin-bottom: $spacing-sm;
  box-shadow: $shadow-sm; position: relative; overflow: hidden;
  &.used, &.expired { opacity: 0.5; }
}
.coupon-left {
  width: 160rpx; text-align: center;
  border-right: 2rpx dashed $border-color; padding-right: $spacing-md;
}
.coupon-amount { color: $price-color; font-weight: 600; }
.amount-symbol { font-size: $font-sm; }
.amount-value { font-size: $font-xxl; }
.amount-unit { font-size: $font-sm; }
.coupon-condition { font-size: $font-xs; color: $text-secondary; margin-top: $spacing-xs; }
.coupon-right { flex: 1; padding-left: $spacing-md; }
.coupon-name { font-size: $font-md; color: $text-primary; font-weight: 500; display: block; }
.coupon-expire { font-size: $font-xs; color: $text-placeholder; margin-top: $spacing-xs; }
.btn-receive {
  background: $brand-primary; color: #fff;
  padding: $spacing-xs $spacing-md; border-radius: $radius-round;
  font-size: $font-sm;
}
</style>
