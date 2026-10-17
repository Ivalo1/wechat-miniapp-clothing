<template>
  <view class="page">
    <view v-for="c in coupons" :key="c.id">
      <coupon-card :coupon="c" :showAction="true" @receive="onReceive(c.id)" />
    </view>
    <empty-state v-if="!coupons.length" text="暂无可领优惠券" icon="🎫" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCouponList, receiveCoupon } from '@/api/coupon'
import CouponCard from '@/components/coupon-card.vue'
import EmptyState from '@/components/empty-state.vue'

const coupons = ref([])
onMounted(async () => { try { coupons.value = await getCouponList() } catch {} })

const onReceive = async (templateId) => {
  try { await receiveCoupon(templateId); uni.showToast({ title: '领取成功' }) } catch {}
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; }
</style>
