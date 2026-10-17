<template>
  <view class="page">
    <view class="address-section card" @click="chooseAddress">
      <view v-if="address" class="address-info">
        <view class="address-top">
          <text class="addr-name">{{ address.receiverName }}</text>
          <text class="addr-phone">{{ address.receiverPhone }}</text>
        </view>
        <text class="addr-detail">{{ address.fullAddress || (address.province + address.city + address.district + address.detailAddress) }}</text>
      </view>
      <view v-else class="no-address">
        <text>请选择收货地址</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <view class="goods-section card">
      <view v-for="item in orderItems" :key="item.skuId" class="goods-item">
        <image :src="item.productImage || item.image" class="goods-image" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-name">{{ item.productName || item.name }}</text>
          <text class="goods-sku">{{ item.skuName }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ formatPrice(item.price) }}</text>
            <text class="goods-qty">×{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="remark-section card">
      <text class="remark-label">订单备注</text>
      <input class="remark-input" v-model="remark" placeholder="选填，请填写备注信息" maxlength="100" />
    </view>

    <view class="summary-section card">
      <view class="summary-row">
        <text>商品金额</text>
        <text>¥{{ formatPrice(totalAmount) }}</text>
      </view>
      <view class="summary-row">
        <text>运费</text>
        <text class="free-ship">免运费</text>
      </view>
      <view class="summary-row total-row">
        <text class="total-label">实付金额</text>
        <text class="total-price">¥{{ formatPrice(totalAmount) }}</text>
      </view>
    </view>

    <view class="submit-bar safe-bottom">
      <view class="submit-total">
        <text>合计: </text>
        <text class="submit-price">¥{{ formatPrice(totalAmount) }}</text>
      </view>
      <view class="btn-submit" :class="{ disabled: submitting }" @click="submitOrder">
        {{ submitting ? '提交中...' : '提交订单' }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAddressList } from '@/api/address'
import { createOrder } from '@/api/order'
import { useCartStore } from '@/stores/cart'
import { usePayment } from '@/composables/usePayment'
import { formatPrice } from '@/utils/format'

const address = ref(null)
const orderItems = ref([])
const remark = ref('')
const submitting = ref(false)
const cartItemIds = ref(null)
const directBuyItems = ref(null)
const cartStore = useCartStore()
const { pay } = usePayment()

const totalAmount = computed(() =>
  orderItems.value.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0)
)

onLoad((options) => {
  if (options.cartItemIds) {
    cartItemIds.value = JSON.parse(options.cartItemIds)
    const selected = cartStore.items.filter(i => cartItemIds.value.includes(i.id))
    orderItems.value = selected.map(i => ({
      skuId: i.skuId, quantity: i.quantity,
      productName: i.productName, skuName: i.skuName,
      productImage: i.productImage, price: i.price
    }))
  } else if (options.directBuyItems) {
    directBuyItems.value = JSON.parse(decodeURIComponent(options.directBuyItems))
    orderItems.value = directBuyItems.value
  }
  loadDefaultAddress()
})

const loadDefaultAddress = async () => {
  try {
    const list = await getAddressList()
    if (list.length) {
      address.value = list.find(a => a.isDefault) || list[0]
    }
  } catch {}
}

const chooseAddress = () => {
  uni.navigateTo({
    url: '/pages/address/list?mode=select',
    events: { selectAddress: (addr) => { address.value = addr } }
  })
}

const submitOrder = async () => {
  if (submitting.value) return
  if (!address.value) { uni.showToast({ title: '请选择收货地址', icon: 'none' }); return }
  submitting.value = true
  try {
    const dto = { addressId: address.value.id, remark: remark.value }
    if (cartItemIds.value) dto.cartItemIds = cartItemIds.value
    else if (directBuyItems.value) dto.directBuyItems = directBuyItems.value
    const orderNo = await createOrder(dto)
    const result = await pay(orderNo)
    if (result.success) {
      uni.redirectTo({ url: `/pages/payment/result?orderNo=${orderNo}&status=success` })
    } else {
      uni.redirectTo({ url: `/pages/payment/result?orderNo=${orderNo}&status=pending` })
    }
  } catch {}
  submitting.value = false
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding-bottom: 120rpx; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin: $spacing-sm $spacing-md; box-shadow: $shadow-sm; }
.address-section { display: flex; align-items: center; }
.address-info { flex: 1; }
.address-top { display: flex; gap: $spacing-sm; margin-bottom: $spacing-xs; }
.addr-name { font-size: $font-md; font-weight: 500; color: $text-primary; }
.addr-phone { font-size: $font-md; color: $text-secondary; }
.addr-detail { font-size: $font-sm; color: $text-secondary; }
.no-address { flex: 1; color: $text-placeholder; font-size: $font-md; }
.arrow { font-size: $font-xl; color: $text-placeholder; }
.goods-item { display: flex; gap: $spacing-sm; padding: $spacing-sm 0; border-bottom: 1rpx solid $border-color; &:last-child { border-bottom: none; } }
.goods-image { width: 160rpx; height: 160rpx; border-radius: $radius-md; }
.goods-info { flex: 1; }
.goods-name { font-size: $font-md; color: $text-primary; @include ellipsis(2); display: block; }
.goods-sku { font-size: $font-xs; color: $text-placeholder; margin: $spacing-xs 0; display: block; }
.goods-bottom { display: flex; justify-content: space-between; align-items: center; }
.goods-price { font-size: $font-md; color: $price-color; font-weight: 500; }
.goods-qty { font-size: $font-sm; color: $text-secondary; }
.remark-label { font-size: $font-md; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.remark-input { font-size: $font-sm; padding: $spacing-sm; background: $bg-page; border-radius: $radius-md; }
.summary-row { display: flex; justify-content: space-between; padding: $spacing-xs 0; font-size: $font-sm; color: $text-secondary; }
.free-ship { color: $success-color; }
.total-row { padding-top: $spacing-sm; border-top: 1rpx solid $border-color; margin-top: $spacing-xs; }
.total-label { font-size: $font-md; font-weight: 500; color: $text-primary; }
.total-price { font-size: $font-xl; color: $price-color; font-weight: 600; }
.submit-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: flex-end;
  background: $bg-card; padding: $spacing-sm $spacing-md;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.06); gap: $spacing-md;
}
.submit-price { color: $price-color; font-size: $font-lg; font-weight: 600; }
.btn-submit {
  background: $brand-primary; color: #fff; padding: $spacing-sm $spacing-xl;
  border-radius: $radius-round; font-size: $font-md; font-weight: 500;
  &.disabled { opacity: 0.6; }
}
</style>
