<template>
  <view class="page">
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="search-bar" @click="goSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索商品</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-area" @scrolltolower="loadMore" refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="refreshing">
      <banner-swiper :banners="banners" />

      <view class="announcement" v-if="announcements.length">
        <text class="ann-icon">📢</text>
        <text class="ann-text">{{ announcements[0].title }}</text>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">热销推荐</text>
        </view>
        <product-list :list="hotProducts" :loading="loadingHot" :finished="true" />
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">猜你喜欢</text>
        </view>
        <product-list :list="guessProducts" :loading="loadingGuess" :finished="guessFinished" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getBanners, getAnnouncements } from '@/api/content'
import { getProductList } from '@/api/product'
import { guessYouLike } from '@/api/recommend'
import BannerSwiper from '@/components/banner-swiper.vue'
import ProductList from '@/components/product-list.vue'

const statusBarHeight = ref(20)
const banners = ref([])
const announcements = ref([])
const hotProducts = ref([])
const guessProducts = ref([])
const loadingHot = ref(false)
const loadingGuess = ref(false)
const guessFinished = ref(false)
const refreshing = ref(false)
const page = ref(1)

onMounted(async () => {
  try {
    const info = uni.getSystemInfoSync()
    statusBarHeight.value = info.statusBarHeight || 20
  } catch {}
  await loadData()
})

onShow(() => {
  loadData()
})

const loadData = async () => {
  try {
    const [b, a, h] = await Promise.all([
      getBanners().catch(() => []),
      getAnnouncements().catch(() => []),
      getProductList({ page: 1, size: 10 }).catch(() => ({ list: [] }))
    ])
    banners.value = b || []
    announcements.value = a || []
    hotProducts.value = h.list || []
  } catch {}
  loadGuess(1)
}

const loadGuess = async (p) => {
  if (loadingGuess.value) return
  loadingGuess.value = true
  try {
    const list = await guessYouLike(20)
    if (p === 1) guessProducts.value = list || []
    else guessProducts.value.push(...(list || []))
    guessFinished.value = !list || list.length < 20
    page.value = p
  } catch {}
  loadingGuess.value = false
}

const loadMore = () => {
  if (!guessFinished.value && !loadingGuess.value) {
    loadGuess(page.value + 1)
  }
}

const onRefresh = async () => {
  refreshing.value = true
  await loadData()
  refreshing.value = false
}

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}
</script>

<style lang="scss" scoped>
.page { height: 100vh; display: flex; flex-direction: column; background: $bg-page; }
.custom-nav {
  background: $bg-card; position: sticky; top: 0; z-index: 100;
}
.nav-content { padding: $spacing-sm $spacing-md; }
.search-bar {
  display: flex; align-items: center; gap: $spacing-xs;
  background: $bg-page; border-radius: $radius-round;
  padding: $spacing-xs $spacing-md; height: 64rpx;
}
.search-icon { font-size: $font-md; }
.search-placeholder { font-size: $font-sm; color: $text-placeholder; }
.scroll-area { flex: 1; }
.announcement {
  display: flex; align-items: center; gap: $spacing-xs;
  background: $bg-card; margin: $spacing-sm $spacing-md;
  padding: $spacing-sm $spacing-md; border-radius: $radius-md;
}
.ann-icon { font-size: $font-md; }
.ann-text { font-size: $font-sm; color: $text-secondary; @include ellipsis; flex: 1; }
.section { margin-top: $spacing-md; }
.section-header { padding: 0 $spacing-md $spacing-sm; }
.section-title { font-size: $font-lg; font-weight: 600; color: $text-primary; }
</style>
