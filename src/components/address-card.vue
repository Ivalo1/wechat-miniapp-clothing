<template>
  <view class="address-card" @click="$emit('select', address)">
    <view class="address-info">
      <view class="address-top">
        <text class="receiver-name">{{ address.receiverName }}</text>
        <text class="receiver-phone">{{ address.receiverPhone }}</text>
        <text v-if="address.isDefault" class="default-tag">默认</text>
      </view>
      <text class="address-detail">{{ address.fullAddress || (address.province + address.city + address.district + address.detailAddress) }}</text>
    </view>
    <view class="address-actions">
      <text class="action-btn" @click.stop="$emit('edit', address)">编辑</text>
      <text class="action-btn delete" @click.stop="$emit('delete', address)">删除</text>
    </view>
  </view>
</template>

<script setup>
defineProps({ address: { type: Object, required: true } })
defineEmits(['select', 'edit', 'delete'])
</script>

<style lang="scss" scoped>
.address-card {
  background: $bg-card; border-radius: $radius-lg;
  padding: $spacing-md; margin-bottom: $spacing-sm;
  box-shadow: $shadow-sm;
}
.address-top { display: flex; align-items: center; gap: $spacing-sm; margin-bottom: $spacing-xs; }
.receiver-name { font-size: $font-md; font-weight: 500; color: $text-primary; }
.receiver-phone { font-size: $font-md; color: $text-secondary; }
.default-tag {
  font-size: $font-xs; color: $brand-primary;
  border: 1rpx solid $brand-primary; border-radius: $radius-sm;
  padding: 0 8rpx;
}
.address-detail { font-size: $font-sm; color: $text-secondary; line-height: 1.5; }
.address-actions {
  display: flex; justify-content: flex-end; gap: $spacing-md;
  margin-top: $spacing-sm; padding-top: $spacing-sm; border-top: 1rpx solid $border-color;
}
.action-btn { font-size: $font-sm; color: $text-secondary; }
.action-btn.delete { color: $error-color; }
</style>
