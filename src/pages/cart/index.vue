<template>
  <view class="page">
    <view v-if="cartStore.items.length" class="cart-content">
      <view v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <view class="item-check" @click="cartStore.toggleSelect(item.id)">
          <view class="checkbox" :class="{ checked: cartStore.selectedIds.has(item.id) }"></view>
        </view>
        <image :src="item.productImage" class="item-image" mode="aspectFill" />
        <view class="item-info">
          <text class="item-name">{{ item.productName }}</text>
          <text class="item-sku">{{ item.skuName }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ formatPrice(item.price) }}</text>
            <counter :modelValue="item.quantity" @change="(v) => onQuantityChange(item.id, v)" />
          </view>
        </view>
        <view class="item-delete" @click="onDelete(item.id)">
          <text>删除</text>
        </view>
      </view>
    </view>
    <empty-state v-else text="购物车是空的" icon="🛒" />

    <view class="cart-footer safe-bottom" v-if="cartStore.items.length">
      <view class="footer-left" @click="cartStore.toggleAll()">
        <view class="checkbox" :class="{ checked: cartStore.isAllSelected }"></view>
        <text class="select-all-text">全选</text>
      </view>
      <view class="footer-right">
        <view class="footer-total">
          <text>合计: </text>
          <text class="total-price">¥{{ formatPrice(cartStore.totalPrice) }}</text>
        </view>
        <view class="btn-checkout" :class="{ disabled: cartStore.selectedItems.length === 0 }" @click="goCheckout">
          结算({{ cartStore.selectedItems.length }})
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'
import { useAuth } from '@/composables/useAuth'
import Counter from '@/components/counter.vue'
import EmptyState from '@/components/empty-state.vue'

const cartStore = useCartStore()
const { checkLogin } = useAuth()

onShow(() => {
  if (checkLogin()) cartStore.fetchCart()
})

const onQuantityChange = async (id, val) => {
  await cartStore.updateQuantity(id, val)
}

const onDelete = (id) => {
  uni.showModal({
    title: '提示', content: '确定删除该商品吗？',
    success: async (res) => { if (res.confirm) await cartStore.removeItem(id) }
  })
}

const goCheckout = () => {
  if (!cartStore.selectedItems.length) return
  if (!checkLogin()) return
  const ids = cartStore.selectedItems.map(i => i.id)
  uni.navigateTo({ url: `/pages/order/create?cartItemIds=${JSON.stringify(ids)}` })
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding-bottom: 120rpx; }
.cart-content { padding: $spacing-md; }
.cart-item {
  display: flex; align-items: center; gap: $spacing-sm;
  background: $bg-card; border-radius: $radius-lg; padding: $spacing-md;
  margin-bottom: $spacing-sm; box-shadow: $shadow-sm; position: relative;
}
.item-check { padding: $spacing-xs; }
.checkbox {
  width: 40rpx; height: 40rpx; border: 2rpx solid $border-color; border-radius: 50%;
  &.checked { background: $brand-primary; border-color: $brand-primary;
    &::after { content: '✓'; color: #fff; font-size: $font-sm; display: flex; align-items: center; justify-content: center; height: 100%; }
  }
}
.item-image { width: 160rpx; height: 160rpx; border-radius: $radius-md; }
.item-info { flex: 1; }
.item-name { font-size: $font-md; color: $text-primary; @include ellipsis(2); display: block; }
.item-sku { font-size: $font-xs; color: $text-placeholder; margin: $spacing-xs 0; display: block; }
.item-bottom { display: flex; justify-content: space-between; align-items: center; margin-top: $spacing-sm; }
.item-price { font-size: $font-lg; color: $price-color; font-weight: 600; }
.item-delete { position: absolute; top: $spacing-sm; right: $spacing-sm; }
.item-delete text { font-size: $font-xs; color: $text-placeholder; }
.cart-footer {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  background: $bg-card; padding: $spacing-sm $spacing-md;
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.06);
}
.footer-left { display: flex; align-items: center; gap: $spacing-xs; }
.select-all-text { font-size: $font-sm; color: $text-secondary; }
.footer-right { display: flex; align-items: center; gap: $spacing-md; }
.total-price { color: $price-color; font-size: $font-lg; font-weight: 600; }
.btn-checkout {
  background: $brand-primary; color: #fff;
  padding: $spacing-xs $spacing-lg; border-radius: $radius-round;
  font-size: $font-md; font-weight: 500;
  &.disabled { opacity: 0.5; }
}
</style>
