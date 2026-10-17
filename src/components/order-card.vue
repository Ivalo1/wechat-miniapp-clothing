<template>
  <view class="order-card" @click="goDetail">
    <view class="card-header">
      <text class="order-no">订单号: {{ order.orderNo }}</text>
      <text class="order-status" :class="'status-' + order.status">{{ order.statusText }}</text>
    </view>
    <view class="card-body">
      <view class="order-items" v-if="order.items">
        <image v-for="item in order.items.slice(0, 3)" :key="item.productId"
          :src="item.productImage" class="item-image" mode="aspectFill" />
      </view>
      <view class="order-info">
        <text class="order-amount">¥{{ formatPrice(order.payAmount || order.totalAmount) }}</text>
      </view>
    </view>
    <view class="card-footer">
      <view class="order-time">{{ formatTime(order.createTime) }}</view>
      <view class="order-actions">
        <text v-if="order.status === 0" class="btn-action btn-primary-sm" @click.stop="$emit('pay', order)">去支付</text>
        <text v-if="order.status === 0" class="btn-action btn-outline-sm" @click.stop="$emit('cancel', order)">取消</text>
        <text v-if="order.status === 2" class="btn-action btn-primary-sm" @click.stop="$emit('confirm', order)">确认收货</text>
        <text v-if="order.status === 4" class="btn-action btn-outline-sm" @click.stop="$emit('review', order)">评价</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { formatPrice, formatTime } from '@/utils/format'

defineProps({
  order: { type: Object, required: true }
})
defineEmits(['pay', 'cancel', 'confirm', 'review'])

const goDetail = () => {
  uni.navigateTo({ url: `/pages/order/detail?orderNo=${order.orderNo || order.orderNo}` })
}
</script>

<style lang="scss" scoped>
.order-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
}
.card-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: $spacing-sm;
}
.order-no { font-size: $font-sm; color: $text-secondary; }
.order-status { font-size: $font-sm; font-weight: 500; color: $brand-primary; }
.card-body { display: flex; align-items: center; gap: $spacing-sm; }
.order-items { display: flex; gap: $spacing-xs; }
.item-image { width: 120rpx; height: 120rpx; border-radius: $radius-sm; }
.order-info { flex: 1; text-align: right; }
.order-amount { font-size: $font-lg; color: $price-color; font-weight: 600; }
.card-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: $spacing-sm; padding-top: $spacing-sm; border-top: 1rpx solid $border-color;
}
.order-time { font-size: $font-xs; color: $text-placeholder; }
.order-actions { display: flex; gap: $spacing-sm; }
.btn-action {
  padding: $spacing-xs $spacing-md;
  border-radius: $radius-round;
  font-size: $font-sm;
}
.btn-primary-sm { background: $brand-primary; color: #fff; }
.btn-outline-sm { border: 1rpx solid $border-color; color: $text-secondary; }
</style>
