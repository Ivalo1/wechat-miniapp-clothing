<template>
  <view class="card">
    <image class="thumb" :src="product.image"></image>
    <view class="info">
      <view class="title">{{ product.name }}</view>
      <view class="price">¥{{ product.price }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductCard',
  props: { product: Object }
}
</script>

<style scoped>
.card { width: 48%; margin: 1%; background: #fff; border-radius: 6px; overflow: hidden; }
.thumb { width: 100%; height: 160px; object-fit: cover; }
.info { padding: 10px; }
.title { font-size: 14px; color: #333; margin-bottom: 6px; }
.price { color: #e64340; font-weight: bold }
</style>
