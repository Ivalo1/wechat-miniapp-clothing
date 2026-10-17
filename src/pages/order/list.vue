<template>
  <view class="page">
    <view class="tab-bar">
      <view v-for="tab in tabs" :key="tab.value" class="tab-item" :class="{ active: activeTab === tab.value }" @click="switchTab(tab.value)">
        <text>{{ tab.label }}</text>
      </view>
    </view>
    <scroll-view scroll-y class="order-list" @scrolltolower="loadMore">
      <order-card v-for="order in orders" :key="order.id" :order="order"
        @pay="onPay" @cancel="onCancel" @confirm="onConfirm" @review="onReview" />
      <view v-if="loading" class="load-text">加载中...</view>
      <view v-if="finished && orders.length" class="load-text">没有更多了</view>
      <empty-state v-if="!loading && !orders.length" text="暂无订单" icon="📋" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderList, cancelOrder, confirmReceive } from '@/api/order'
import { usePayment } from '@/composables/usePayment'
import OrderCard from '@/components/order-card.vue'
import EmptyState from '@/components/empty-state.vue'

const tabs = [
  { label: '全部', value: null },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 4 }
]
const activeTab = ref(null)
const orders = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const { pay } = usePayment()

onLoad((options) => {
  if (options.status !== undefined) activeTab.value = Number(options.status)
  loadOrders(1)
})

const switchTab = (val) => { activeTab.value = val; loadOrders(1) }

const loadOrders = async (p) => {
  if (loading.value) return
  loading.value = true
  try {
    const params = { page: p, size: 10 }
    if (activeTab.value !== null) params.status = activeTab.value
    const res = await getOrderList(params)
    if (p === 1) orders.value = res.list || []
    else orders.value.push(...(res.list || []))
    finished.value = orders.value.length >= (res.total || 0)
    page.value = p
  } catch {}
  loading.value = false
}

const loadMore = () => { if (!finished.value) loadOrders(page.value + 1) }

const onPay = async (order) => { await pay(order.orderNo) }
const onCancel = async (order) => {
  uni.showModal({ title: '提示', content: '确定取消订单？', success: async (res) => {
    if (res.confirm) { await cancelOrder(order.orderNo); uni.showToast({ title: '已取消' }); loadOrders(1) }
  }})
}
const onConfirm = async (order) => {
  uni.showModal({ title: '提示', content: '确认已收到商品？', success: async (res) => {
    if (res.confirm) { await confirmReceive(order.orderNo); uni.showToast({ title: '已确认' }); loadOrders(1) }
  }})
}
const onReview = (order) => {
  if (order.items?.length) {
    uni.navigateTo({ url: `/pages/review/create?productId=${order.items[0].productId}&orderId=${order.orderNo}&orderItemId=${order.items[0].productId}` })
  }
}
</script>

<style lang="scss" scoped>
.page { height: 100vh; display: flex; flex-direction: column; background: $bg-page; }
.tab-bar {
  display: flex; background: $bg-card; border-bottom: 1rpx solid $border-color;
}
.tab-item {
  flex: 1; text-align: center; padding: $spacing-md 0;
  font-size: $font-sm; color: $text-secondary; position: relative;
  &.active { color: $brand-primary; font-weight: 600;
    &::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 48rpx; height: 4rpx; background: $brand-primary; border-radius: 2rpx; }
  }
}
.order-list { flex: 1; padding: $spacing-md; }
.load-text { text-align: center; padding: $spacing-lg; font-size: $font-sm; color: $text-placeholder; }
</style>
