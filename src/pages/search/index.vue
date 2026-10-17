<template>
  <view class="page">
    <view class="search-header">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input class="search-input" v-model="keyword" placeholder="搜索商品" confirm-type="search"
          @confirm="doSearch" @input="onInput" focus />
        <text v-if="keyword" class="clear-btn" @click="keyword = ''">✕</text>
      </view>
      <text class="search-btn" @click="doSearch">搜索</text>
    </view>

    <view v-if="!hasSearched" class="history-section">
      <view class="section-header">
        <text class="section-title">搜索历史</text>
        <text class="clear-history" @click="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <text v-for="item in history" :key="item" class="history-tag" @click="searchBy(item)">{{ item }}</text>
      </view>
    </view>

    <product-list v-else :list="products" :loading="loading" :finished="finished" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getProductList } from '@/api/product'
import ProductList from '@/components/product-list.vue'
import { storage } from '@/utils/storage'

const keyword = ref('')
const products = ref([])
const loading = ref(false)
const finished = ref(false)
const hasSearched = ref(false)
const page = ref(1)
const history = ref(storage.get('searchHistory') || [])

let timer = null
const onInput = () => {
  clearTimeout(timer)
  timer = setTimeout(() => { if (keyword.value.trim()) doSearch() }, 500)
}

const doSearch = async () => {
  const kw = keyword.value.trim()
  if (!kw) return
  hasSearched.value = true
  loading.value = true
  page.value = 1
  saveHistory(kw)
  try {
    const res = await getProductList({ keyword: kw, page: 1, size: 20 })
    products.value = res.list || []
    finished.value = products.value.length >= (res.total || 0)
  } catch {}
  loading.value = false
}

const searchBy = (item) => { keyword.value = item; doSearch() }

const saveHistory = (kw) => {
  const list = history.value.filter(h => h !== kw)
  list.unshift(kw)
  history.value = list.slice(0, 10)
  storage.set('searchHistory', history.value)
}

const clearHistory = () => { history.value = []; storage.remove('searchHistory') }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; }
.search-header {
  display: flex; align-items: center; gap: $spacing-sm;
  padding: $spacing-sm $spacing-md; background: $bg-card;
}
.search-input-wrap {
  flex: 1; display: flex; align-items: center; gap: $spacing-xs;
  background: $bg-page; border-radius: $radius-round; padding: $spacing-xs $spacing-md; height: 64rpx;
}
.search-icon { font-size: $font-md; }
.search-input { flex: 1; font-size: $font-md; }
.clear-btn { font-size: $font-md; color: $text-placeholder; padding: $spacing-xs; }
.search-btn { font-size: $font-md; color: $brand-primary; white-space: nowrap; }
.history-section { padding: $spacing-md; }
.section-header { display: flex; justify-content: space-between; margin-bottom: $spacing-md; }
.section-title { font-size: $font-md; font-weight: 500; color: $text-primary; }
.clear-history { font-size: $font-sm; color: $text-placeholder; }
.history-tags { display: flex; flex-wrap: wrap; gap: $spacing-sm; }
.history-tag {
  padding: $spacing-xs $spacing-md; background: $bg-card;
  border-radius: $radius-round; font-size: $font-sm; color: $text-secondary;
}
</style>
