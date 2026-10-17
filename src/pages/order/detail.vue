<template>
  <view class="page">
    <view class="status-header" :class="'status-bg-' + order.status">
      <text class="status-text">{{ order.statusText }}</text>
    </view>

    <view class="address-section card" v-if="order.addressSnapshot">
      <text class="address-text">{{ order.addressSnapshot }}</text>
    </view>

    <view class="goods-section card">
      <view v-for="item in order.items" :key="item.productId" class="goods-item">
        <image :src="item.productImage" class="goods-image" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-name">{{ item.productName }}</text>
          <text class="goods-sku">{{ item.skuName }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ formatPrice(item.price) }}</text>
            <text class="goods-qty">×{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="price-section card">
      <view class="price-row"><text>商品总额</text><text>¥{{ formatPrice(order.totalAmount) }}</text></view>
      <view class="price-row" v-if="order.discountAmount"><text>优惠</text><text class="discount">-¥{{ formatPrice(order.discountAmount) }}</text></view>
      <view class="price-row"><text>运费</text><text>免运费</text></view>
      <view class="price-row total"><text>实付</text><text class="pay-amount">¥{{ formatPrice(order.payAmount) }}</text></view>
    </view>

    <view class="info-section card">
      <view class="info-row"><text class="info-label">订单编号</text><text class="info-value" @click="copyOrderNo">{{ order.orderNo }}</text></view>
      <view class="info-row"><text class="info-label">下单时间</text><text class="info-value">{{ formatTime(order.createTime) }}</text></view>
      <view class="info-row" v-if="order.payTime"><text class="info-label">支付时间</text><text class="info-value">{{ formatTime(order.payTime) }}</text></view>
    </view>

    <view class="action-bar safe-bottom" v-if="showActions">
      <text v-if="order.status === 0" class="btn-action outline" @click="onCancel">取消订单</text>
      <text v-if="order.status === 0" class="btn-action primary" @click="onPay">去支付</text>
      <text v-if="order.status === 2" class="btn-action primary" @click="onConfirm">确认收货</text>
      <text v-if="order.status === 2" class="btn-action outline" @click="goLogistics">查看物流</text>
      <text v-if="order.status === 4" class="btn-action outline" @click="goRefund">申请售后</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail, cancelOrder, confirmReceive } from '@/api/order'
import { usePayment } from '@/composables/usePayment'
import { formatPrice, formatTime } from '@/utils/format'

const order = ref({ items: [] })
const { pay } = usePayment()
let orderNo = ''

const showActions = computed(() => [0, 2, 4].includes(order.value.status))

onLoad((options) => { orderNo = options.orderNo; loadDetail() })

const loadDetail = async () => {
  try { order.value = await getOrderDetail(orderNo) } catch {}
}

const copyOrderNo = () => {
  uni.setClipboardData({ data: order.value.orderNo, success: () => uni.showToast({ title: '已复制' }) })
}

const onCancel = () => {
  uni.showModal({ title: '提示', content: '确定取消订单？', success: async (res) => {
    if (res.confirm) { await cancelOrder(orderNo); uni.showToast({ title: '已取消' }); loadDetail() }
  }})
}
const onPay = async () => { await pay(orderNo) }
const onConfirm = () => {
  uni.showModal({ title: '提示', content: '确认已收到？', success: async (res) => {
    if (res.confirm) { await confirmReceive(orderNo); uni.showToast({ title: '已确认' }); loadDetail() }
  }})
}
const goLogistics = () => { uni.navigateTo({ url: `/pages/logistics/track?orderNo=${orderNo}` }) }
const goRefund = () => { uni.navigateTo({ url: `/pages/refund/apply?orderNo=${orderNo}` }) }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding-bottom: 120rpx; }
.status-header { padding: $spacing-lg $spacing-md; color: #fff; }
.status-text { font-size: $font-xl; font-weight: 600; }
.status-bg-0 { background: linear-gradient(135deg, $warning-color, #FFD666); }
.status-bg-1, .status-bg-2 { background: linear-gradient(135deg, $brand-primary, $brand-secondary); }
.status-bg-3, .status-bg-4 { background: linear-gradient(135deg, $success-color, #95DE64); }
.status-bg-5, .status-bg-6 { background: linear-gradient(135deg, $text-placeholder, #D9D9D9); }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin: $spacing-sm $spacing-md; box-shadow: $shadow-sm; }
.address-text { font-size: $font-sm; color: $text-secondary; line-height: 1.6; }
.goods-item { display: flex; gap: $spacing-sm; padding: $spacing-sm 0; border-bottom: 1rpx solid $border-color; &:last-child { border-bottom: none; } }
.goods-image { width: 140rpx; height: 140rpx; border-radius: $radius-md; }
.goods-info { flex: 1; }
.goods-name { font-size: $font-md; color: $text-primary; @include ellipsis(2); display: block; }
.goods-sku { font-size: $font-xs; color: $text-placeholder; display: block; margin: $spacing-xs 0; }
.goods-bottom { display: flex; justify-content: space-between; }
.goods-price { color: $price-color; font-weight: 500; }
.goods-qty { color: $text-secondary; font-size: $font-sm; }
.price-row { display: flex; justify-content: space-between; padding: $spacing-xs 0; font-size: $font-sm; color: $text-secondary; }
.price-row.total { padding-top: $spacing-sm; border-top: 1rpx solid $border-color; margin-top: $spacing-xs; }
.discount { color: $success-color; }
.pay-amount { color: $price-color; font-size: $font-lg; font-weight: 600; }
.info-row { display: flex; justify-content: space-between; padding: $spacing-xs 0; font-size: $font-sm; }
.info-label { color: $text-secondary; }
.info-value { color: $text-primary; }
.action-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: flex-end; gap: $spacing-sm;
  background: $bg-card; padding: $spacing-sm $spacing-md;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.06);
}
.btn-action {
  padding: $spacing-xs $spacing-xl; border-radius: $radius-round; font-size: $font-md;
  &.primary { background: $brand-primary; color: #fff; }
  &.outline { border: 1rpx solid $border-color; color: $text-secondary; }
}
</style>
