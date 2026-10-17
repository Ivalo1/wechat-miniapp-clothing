<template>
  <view class="product-card" @click="goDetail">
    <image class="card-image" :src="product.mainImage" mode="aspectFill" lazy-load />
    <view class="card-info">
      <text class="card-title">{{ product.name }}</text>
      <view class="card-bottom">
        <view class="card-price">
          <text class="price-symbol">¥</text>
          <text class="price-integer">{{ priceInt }}</text>
          <text class="price-decimal">.{{ priceDec }}</text>
        </view>
        <text class="card-sales">已售{{ formatSales(product.sales) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { formatSales, formatPriceInt, formatPriceDec } from '@/utils/format'

const props = defineProps({
  product: { type: Object, required: true }
})

const priceInt = computed(() => formatPriceInt(props.product.price))
const priceDec = computed(() => formatPriceDec(props.product.price))

const goDetail = () => {
  uni.navigateTo({ url: `/pages/product/detail?id=${props.product.id}` })
}
</script>

<style lang="scss" scoped>
.product-card {
  width: 48%;
  background: $bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
}
.card-image { width: 100%; height: 340rpx; }
.card-info { padding: $spacing-sm $spacing-md; }
.card-title {
  font-size: $font-md;
  color: $text-primary;
  @include ellipsis(2);
  line-height: 1.4;
  min-height: 78rpx;
}
.card-bottom {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: $spacing-xs;
}
.card-price { color: $price-color; font-weight: 600; }
.price-symbol { font-size: $font-xs; }
.price-integer { font-size: $font-lg; }
.price-decimal { font-size: $font-xs; }
.card-sales { font-size: $font-xs; color: $text-placeholder; }
</style>
