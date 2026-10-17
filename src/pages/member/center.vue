<template>
  <view class="page">
    <view class="header-card card">
      <image class="avatar" :src="info.avatar || '/static/images/default-avatar.png'" />
      <view class="user-info">
        <text class="nickname">{{ info.nickname || '用户' }}</text>
        <text class="level">{{ info.levelName || '普通会员' }}</text>
      </view>
    </view>
    <view class="stats-card card">
      <view class="stat-item">
        <text class="stat-value">{{ info.points || 0 }}</text>
        <text class="stat-label">当前积分</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">¥{{ formatPrice(info.totalConsumed) }}</text>
        <text class="stat-label">累计消费</text>
      </view>
    </view>
    <view class="action-card card">
      <button class="btn-sign" :class="{ disabled: info.signedToday }" @click="handleSignIn">
        {{ info.signedToday ? '今日已签到 ✓' : '立即签到' }}
      </button>
    </view>
    <view class="menu-card card">
      <view class="menu-item" @click="goPage('/pages/member/points')">
        <text>积分明细</text><text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMemberInfo, signIn } from '@/api/member'
import { formatPrice } from '@/utils/format'

const info = ref({})
onShow(async () => { try { info.value = await getMemberInfo() } catch {} })

const handleSignIn = async () => {
  if (info.value.signedToday) return
  try { await signIn(); uni.showToast({ title: '签到成功' }); info.value.signedToday = true } catch {}
}
const goPage = (url) => { uni.navigateTo({ url }) }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.header-card { display: flex; align-items: center; gap: $spacing-md; }
.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; }
.nickname { font-size: $font-xl; font-weight: 600; color: $text-primary; display: block; }
.level { font-size: $font-sm; color: $brand-primary; margin-top: $spacing-xs; }
.stats-card { display: flex; }
.stat-item { flex: 1; text-align: center; }
.stat-value { font-size: $font-xxl; color: $brand-primary; font-weight: 600; display: block; }
.stat-label { font-size: $font-xs; color: $text-secondary; margin-top: $spacing-xs; }
.stat-divider { width: 1rpx; background: $border-color; }
.btn-sign {
  background: $brand-primary; color: #fff; border: none; border-radius: $radius-round;
  padding: $spacing-sm 0; font-size: $font-md; width: 100%;
  &.disabled { background: $border-color; color: $text-placeholder; }
  &::after { border: none; }
}
.menu-item { display: flex; justify-content: space-between; padding: $spacing-md 0; border-bottom: 1rpx solid $border-color; &:last-child { border-bottom: none; } }
.arrow { color: $text-placeholder; font-size: $font-lg; }
</style>
