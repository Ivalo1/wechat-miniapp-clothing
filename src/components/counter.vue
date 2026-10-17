<template>
  <view class="counter">
    <view class="counter-btn" :class="{ disabled: modelValue <= min }" @click="decrease">
      <text>−</text>
    </view>
    <text class="counter-value">{{ modelValue }}</text>
    <view class="counter-btn" :class="{ disabled: modelValue >= max }" @click="increase">
      <text>+</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 }
})
const emit = defineEmits(['update:modelValue', 'change'])

const decrease = () => {
  if (props.modelValue > props.min) {
    const val = props.modelValue - 1
    emit('update:modelValue', val)
    emit('change', val)
  }
}
const increase = () => {
  if (props.modelValue < props.max) {
    const val = props.modelValue + 1
    emit('update:modelValue', val)
    emit('change', val)
  }
}
</script>

<style lang="scss" scoped>
.counter {
  display: inline-flex;
  align-items: center;
  border: 1rpx solid $border-color;
  border-radius: $radius-sm;
  overflow: hidden;
}
.counter-btn {
  width: 56rpx; height: 56rpx;
  @include flex-center;
  font-size: $font-lg;
  color: $text-primary;
  &.disabled { color: $text-placeholder; opacity: 0.4; }
}
.counter-value {
  min-width: 64rpx;
  text-align: center;
  font-size: $font-md;
  border-left: 1rpx solid $border-color;
  border-right: 1rpx solid $border-color;
}
</style>
