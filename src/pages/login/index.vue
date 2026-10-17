<template>
  <view class="page">
    <view class="brand-section">
      <text class="brand-icon">👗</text>
      <text class="brand-name">服装优选</text>
      <text class="brand-desc">品质生活，从穿搭开始</text>
    </view>
    <view class="login-section">
      <button class="btn-wx-login" @click="handleLogin">微信一键登录</button>
      <view class="agreement">
        <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed"></view>
        <text class="agreement-text">登录即同意</text>
        <text class="agreement-link">《用户协议》</text>
        <text class="agreement-text">和</text>
        <text class="agreement-link">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const agreed = ref(false)
const userStore = useUserStore()

const handleLogin = async () => {
  if (!agreed.value) { uni.showToast({ title: '请先同意协议', icon: 'none' }); return }
  try {
    await userStore.login()
    uni.showToast({ title: '登录成功' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch {
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: $spacing-xl; }
.brand-section { text-align: center; margin-bottom: 120rpx; }
.brand-icon { font-size: 120rpx; display: block; margin-bottom: $spacing-md; }
.brand-name { font-size: $font-xxl; font-weight: 700; color: $brand-primary; display: block; }
.brand-desc { font-size: $font-md; color: $text-secondary; margin-top: $spacing-sm; }
.login-section { width: 100%; }
.btn-wx-login {
  background: #07C160; color: #fff; border: none; border-radius: $radius-round;
  padding: $spacing-sm 0; font-size: $font-lg; width: 100%;
  &::after { border: none; }
}
.agreement { display: flex; align-items: center; justify-content: center; gap: 8rpx; margin-top: $spacing-lg; flex-wrap: wrap; }
.checkbox {
  width: 32rpx; height: 32rpx; border: 2rpx solid $border-color; border-radius: 50%;
  &.checked { background: $brand-primary; border-color: $brand-primary; }
}
.agreement-text { font-size: $font-xs; color: $text-secondary; }
.agreement-link { font-size: $font-xs; color: $brand-primary; }
</style>
