<template>
  <view class="review-item">
    <view class="review-header">
      <image class="reviewer-avatar" :src="review.avatar || '/static/images/default-avatar.png'" />
      <view class="reviewer-info">
        <text class="reviewer-name">{{ review.nickname }}</text>
        <text class="review-sku">{{ review.skuName }}</text>
      </view>
      <view class="review-rating">
        <text v-for="i in 5" :key="i" class="star" :class="{ active: i <= review.rating }">★</text>
      </view>
    </view>
    <text class="review-content" v-if="review.content">{{ review.content }}</text>
    <view class="review-images" v-if="review.images">
      <image v-for="(img, idx) in parsedImages" :key="idx" :src="img" class="review-image" mode="aspectFill"
        @click="previewImage(idx)" />
    </view>
    <text class="review-time">{{ formatTime(review.createTime) }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '@/utils/format'

const props = defineProps({ review: { type: Object, required: true } })

const parsedImages = computed(() => {
  if (!props.review.images) return []
  return props.review.images.split(',').filter(Boolean)
})

const previewImage = (idx) => {
  uni.previewImage({ urls: parsedImages.value, current: parsedImages.value[idx] })
}
</script>

<style lang="scss" scoped>
.review-item { padding: $spacing-md 0; border-bottom: 1rpx solid $border-color; }
.review-header { display: flex; align-items: center; gap: $spacing-sm; margin-bottom: $spacing-sm; }
.reviewer-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; }
.reviewer-info { flex: 1; }
.reviewer-name { font-size: $font-sm; color: $text-primary; display: block; }
.review-sku { font-size: $font-xs; color: $text-placeholder; }
.review-rating { .star { color: $border-color; font-size: $font-md; &.active { color: #FFB800; } } }
.review-content { font-size: $font-sm; color: $text-primary; line-height: 1.6; margin-bottom: $spacing-sm; }
.review-images { display: flex; gap: $spacing-xs; flex-wrap: wrap; margin-bottom: $spacing-sm; }
.review-image { width: 160rpx; height: 160rpx; border-radius: $radius-sm; }
.review-time { font-size: $font-xs; color: $text-placeholder; }
</style>
