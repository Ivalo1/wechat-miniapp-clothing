<template>
  <view class="login-mask" v-if="show" @click.self="$emit('close')">
    <view class="login-popup">
      <text class="popup-title">登录「服装优选」</text>
      <text class="popup-desc">授权微信登录，享受购物体验</text>
      <button class="btn-login" open-type="getPhoneNumber" @click="handleLogin">
        微信一键登录
      </button>
      <text class="popup-close" @click="$emit('close')">暂不登录</text>
    </view>
  </view>
</template>

<script setup>
defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['close', 'login'])

const handleLogin = () => {
  emit('login')
}
</script>

<style lang="scss" scoped>
.login-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 999;
  @include flex-center;
}
.login-popup {
  width: 580rpx; background: $bg-card; border-radius: $radius-xl;
  padding: $spacing-xl; text-align: center;
}
.popup-title { font-size: $font-xl; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.popup-desc { font-size: $font-sm; color: $text-secondary; display: block; margin-bottom: $spacing-xl; }
.btn-login {
  background: $brand-primary; color: #fff; border: none;
  border-radius: $radius-round; padding: $spacing-sm 0;
  font-size: $font-lg; width: 100%;
  &::after { border: none; }
}
.popup-close {
  display: block; margin-top: $spacing-lg;
  font-size: $font-sm; color: $text-placeholder;
}
</style>
