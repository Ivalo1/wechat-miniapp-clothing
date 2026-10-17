<template>
  <view class="page">
    <view class="tab-bar">
      <view v-for="tab in tabs" :key="tab.value" class="tab-item" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        <text>{{ tab.label }}</text>
      </view>
    </view>
    <view class="coupon-list">
      <coupon-card v-for="c in filteredCoupons" :key="c.id" :coupon="c" />
    </view>
    <empty-state v-if="!filteredCoupons.length" text="暂无优惠券" icon="🎫" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCouponList } from '@/api/coupon'
import CouponCard from '@/components/coupon-card.vue'
import EmptyState from '@/components/empty-state.vue'

const tabs = [{ label: '可使用', value: 0 }, { label: '已使用', value: 1 }, { label: '已过期', value: 2 }]
const activeTab = ref(0)
const coupons = ref([])
onMounted(async () => { try { coupons.value = await getCouponList() } catch {} })
const filteredCoupons = computed(() => coupons.value.filter(c => (c.status || 0) === activeTab.value))
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; }
.tab-bar { display: flex; background: $bg-card; border-bottom: 1rpx solid $border-color; }
.tab-item { flex: 1; text-align: center; padding: $spacing-md 0; font-size: $font-sm; color: $text-secondary; position: relative;
  &.active { color: $brand-primary; font-weight: 600;
    &::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 48rpx; height: 4rpx; background: $brand-primary; border-radius: 2rpx; } } }
.coupon-list { padding: $spacing-md; }
</style>
