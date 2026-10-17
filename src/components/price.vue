<template>
  <view class="price-wrap" :class="'size-' + (size || 'md')">
    <text class="price-symbol">¥</text>
    <text class="price-integer">{{ priceInt }}</text>
    <text class="price-decimal">.{{ priceDec }}</text>
    <text class="price-original" v-if="originalPrice">¥{{ formatPrice(originalPrice) }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice, formatPriceInt, formatPriceDec } from '@/utils/format'

const props = defineProps({
  price: { type: [Number, String], default: 0 },
  originalPrice: { type: [Number, String], default: null },
  size: { type: String, default: 'md' }
})

const priceInt = computed(() => formatPriceInt(props.price))
const priceDec = computed(() => formatPriceDec(props.price))
</script>

<style lang="scss" scoped>
.price-wrap {
  display: inline-flex;
  align-items: baseline;
  color: $price-color;
  font-weight: 600;
}
.size-lg { .price-integer { font-size: $font-xxl; } .price-symbol, .price-decimal { font-size: $font-md; } }
.size-md { .price-integer { font-size: $font-xl; } .price-symbol, .price-decimal { font-size: $font-sm; } }
.size-sm { .price-integer { font-size: $font-lg; } .price-symbol, .price-decimal { font-size: $font-xs; } }
.price-original {
  color: $text-placeholder;
  font-size: $font-sm;
  text-decoration: line-through;
  margin-left: $spacing-xs;
  font-weight: 400;
}
</style>
