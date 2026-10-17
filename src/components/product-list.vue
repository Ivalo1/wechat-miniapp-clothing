<template>
  <view class="product-list">
    <view class="list-grid" v-if="list.length">
      <product-card v-for="item in list" :key="item.id" :product="item" />
    </view>
    <view class="load-status" v-if="loading">
      <text class="load-text">加载中...</text>
    </view>
    <view class="load-status" v-else-if="finished && list.length">
      <text class="load-text">没有更多了</text>
    </view>
    <empty-state v-if="!loading && list.length === 0" text="暂无商品" />
  </view>
</template>

<script setup>
import ProductCard from './product-card.vue'
import EmptyState from './empty-state.vue'

defineProps({
  list: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  finished: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
.list-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 $spacing-md;
}
.load-status {
  text-align: center;
  padding: $spacing-lg 0;
}
.load-text {
  font-size: $font-sm;
  color: $text-placeholder;
}
</style>
