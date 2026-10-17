<template>
  <view class="page">
    <view class="header-bg">
      <view class="user-info" :style="{ paddingTop: (statusBarHeight + 10) + 'px' }">
        <image class="avatar" :src="memberInfo.avatar || '/static/images/default-avatar.png'" />
        <view class="user-detail">
          <text class="nickname">{{ memberInfo.nickname || '未登录' }}</text>
          <text class="level-tag" v-if="memberInfo.levelName">{{ memberInfo.levelName }}</text>
        </view>
        <view v-if="!isLoggedIn" class="login-btn" @click="goLogin">
          <text>点击登录</text>
        </view>
      </view>
    </view>

    <view class="member-card card">
      <view class="card-row">
        <view class="stat-item" @click="goPage('/pages/member/points')">
          <text class="stat-value">{{ memberInfo.points || 0 }}</text>
          <text class="stat-label">积分</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">¥{{ formatPrice(memberInfo.totalConsumed) }}</text>
          <text class="stat-label">累计消费</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="handleSignIn">
          <text class="stat-value">{{ memberInfo.signedToday ? '已签' : '签到' }}</text>
          <text class="stat-label">今日</text>
        </view>
      </view>
    </view>

    <view class="order-section card">
      <view class="section-header">
        <text class="section-title">我的订单</text>
        <view class="section-more" @click="goPage('/pages/order/list')">
          <text>查看全部</text>
          <text class="arrow">›</text>
        </view>
      </view>
      <view class="order-shortcuts">
        <view class="shortcut-item" @click="goOrderList(0)">
          <text class="shortcut-icon">💰</text>
          <text class="shortcut-text">待付款</text>
        </view>
        <view class="shortcut-item" @click="goOrderList(1)">
          <text class="shortcut-icon">📦</text>
          <text class="shortcut-text">待发货</text>
        </view>
        <view class="shortcut-item" @click="goOrderList(2)">
          <text class="shortcut-icon">🚚</text>
          <text class="shortcut-text">待收货</text>
        </view>
        <view class="shortcut-item" @click="goOrderList(4)">
          <text class="shortcut-icon">✅</text>
          <text class="shortcut-text">已完成</text>
        </view>
        <view class="shortcut-item" @click="goPage('/pages/refund/list')">
          <text class="shortcut-icon">🔄</text>
          <text class="shortcut-text">售后</text>
        </view>
      </view>
    </view>

    <view class="menu-section card">
      <view class="menu-item" @click="goPage('/pages/coupon/list')">
        <text class="menu-icon">🎫</text>
        <text class="menu-text">我的优惠券</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/favorite/list')">
        <text class="menu-icon">❤️</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/address/list')">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goPage('/pages/member/center')">
        <text class="menu-icon">👑</text>
        <text class="menu-text">会员中心</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getMemberInfo, signIn } from '@/api/member'
import { formatPrice } from '@/utils/format'

const userStore = useUserStore()
const isLoggedIn = ref(false)
const statusBarHeight = ref(20)
const memberInfo = ref({})

try {
  const info = uni.getSystemInfoSync()
  statusBarHeight.value = info.statusBarHeight || 20
} catch {}

onShow(() => {
  isLoggedIn.value = userStore.isLoggedIn
  if (userStore.isLoggedIn) loadMemberInfo()
})

const loadMemberInfo = async () => {
  try {
    memberInfo.value = await getMemberInfo()
  } catch {}
}

const handleSignIn = async () => {
  if (!userStore.isLoggedIn) { goLogin(); return }
  if (memberInfo.value.signedToday) { uni.showToast({ title: '今日已签到', icon: 'none' }); return }
  try {
    await signIn()
    uni.showToast({ title: '签到成功', icon: 'success' })
    loadMemberInfo()
  } catch {}
}

const goLogin = () => { uni.navigateTo({ url: '/pages/login/index' }) }
const goPage = (url) => { uni.navigateTo({ url }) }
const goOrderList = (status) => { uni.navigateTo({ url: `/pages/order/list?status=${status}` }) }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; }
.header-bg {
  background: linear-gradient(135deg, $brand-primary, $brand-secondary);
  padding-bottom: $spacing-xl;
}
.user-info {
  display: flex; align-items: center; gap: $spacing-md;
  padding: $spacing-lg $spacing-md;
}
.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; border: 4rpx solid rgba(255,255,255,0.3); }
.user-detail { flex: 1; }
.nickname { font-size: $font-xl; color: #fff; font-weight: 600; display: block; }
.level-tag {
  display: inline-block; margin-top: $spacing-xs;
  background: rgba(255,255,255,0.2); color: #fff;
  padding: 2rpx 16rpx; border-radius: $radius-round;
  font-size: $font-xs;
}
.login-btn text { color: #fff; font-size: $font-sm; }
.member-card { margin: -#{$spacing-lg} $spacing-md $spacing-md; }
.card-row { display: flex; align-items: center; }
.stat-item { flex: 1; text-align: center; }
.stat-value { font-size: $font-xl; color: $brand-primary; font-weight: 600; display: block; }
.stat-label { font-size: $font-xs; color: $text-secondary; margin-top: $spacing-xs; }
.stat-divider { width: 1rpx; height: 60rpx; background: $border-color; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: $spacing-md; }
.section-title { font-size: $font-lg; font-weight: 600; color: $text-primary; }
.section-more { display: flex; align-items: center; gap: 4rpx;
  text { font-size: $font-sm; color: $text-placeholder; } }
.arrow { font-size: $font-lg; color: $text-placeholder; }
.order-shortcuts { display: flex; }
.shortcut-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: $spacing-xs; }
.shortcut-icon { font-size: 48rpx; }
.shortcut-text { font-size: $font-xs; color: $text-secondary; }
.menu-item {
  display: flex; align-items: center; padding: $spacing-md 0;
  border-bottom: 1rpx solid $border-color;
  &:last-child { border-bottom: none; }
}
.menu-icon { font-size: 40rpx; margin-right: $spacing-md; }
.menu-text { flex: 1; font-size: $font-md; color: $text-primary; }
.menu-arrow { font-size: $font-xl; color: $text-placeholder; }
</style>
