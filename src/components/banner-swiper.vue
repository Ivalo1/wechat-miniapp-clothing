<template>
  <swiper class="banner-swiper" :autoplay="true" :interval="4000" :circular="true" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#FFFFFF">
    <swiper-item v-for="item in banners" :key="item.id" @click="onClick(item)">
      <image class="banner-image" :src="item.imageUrl" mode="aspectFill" />
    </swiper-item>
  </swiper>
</template>

<script setup>
const props = defineProps({
  banners: { type: Array, default: () => [] }
})

const onClick = (item) => {
  if (!item.linkValue) return
  if (item.linkType === 'product') {
    uni.navigateTo({ url: `/pages/product/detail?id=${item.linkValue}` })
  } else if (item.linkType === 'url') {
    // webview not implemented yet
  }
}
</script>

<style lang="scss" scoped>
.banner-swiper { width: 100%; height: 320rpx; border-radius: $radius-lg; overflow: hidden; }
.banner-image { width: 100%; height: 100%; }
</style>
