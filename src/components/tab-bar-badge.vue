<template>
  <view class="badge" v-if="count > 0">
    <text class="badge-text">{{ count > 99 ? '99+' : count }}</text>
  </view>
</template>

<script setup>
defineProps({ count: { type: Number, default: 0 } })
</script>

<style lang="scss" scoped>
.badge {
  position: absolute; top: -8rpx; right: -8rpx;
  min-width: 32rpx; height: 32rpx;
  background: $error-color; border-radius: $radius-round;
  display: flex; align-items: center; justify-content: center;
  padding: 0 6rpx;
}
.badge-text { color: #fff; font-size: 20rpx; line-height: 32rpx; }
</style>
