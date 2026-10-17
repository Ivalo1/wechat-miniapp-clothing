<template>
  <view class="page">
    <view class="result-section">
      <text class="result-icon">{{ isSuccess ? '✅' : '⏳' }}</text>
      <text class="result-title">{{ isSuccess ? '支付成功' : '等待支付' }}</text>
      <text class="result-desc" v-if="orderNo">订单号: {{ orderNo }}</text>
    </view>
    <view class="action-section">
      <button class="btn-primary" @click="goOrder">查看订单</button>
      <button class="btn-outline" @click="goHome">返回首页</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const orderNo = ref('')
const isSuccess = ref(false)

onLoad((options) => {
  orderNo.value = options.orderNo || ''
  isSuccess.value = options.status === 'success'
})

const goOrder = () => { uni.navigateTo({ url: `/pages/order/detail?orderNo=${orderNo.value}` }) }
const goHome = () => { uni.switchTab({ url: '/pages/index/index' }) }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; display: flex; flex-direction: column; align-items: center; padding-top: 200rpx; }
.result-section { text-align: center; margin-bottom: $spacing-xl; }
.result-icon { font-size: 120rpx; display: block; margin-bottom: $spacing-md; }
.result-title { font-size: $font-xl; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.result-desc { font-size: $font-sm; color: $text-secondary; }
.action-section { display: flex; flex-direction: column; gap: $spacing-md; width: 400rpx; }
.btn-primary { background: $brand-primary; color: #fff; border: none; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
.btn-outline { background: transparent; color: $text-secondary; border: 1rpx solid $border-color; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
</style>
