<template>
  <view class="page">
    <view class="header">服装类小程序示例</view>
    <view class="product-list">
      <product-card v-for="item in products" :key="item.id" :product="item" />
    </view>
  </view>
</template>

<script>
import ProductCard from '../../components/ProductCard.vue'
import { sampleProducts } from '../../utils/mock-products'

export default {
  components: { ProductCard },
  data() {
    return {
      products: sampleProducts
    }
  }
}
</script>

<style scoped>
.page { padding: 20px; }
.header { font-size: 20px; margin-bottom: 12px; }
.product-list { display: flex; flex-wrap: wrap; }
</style>
