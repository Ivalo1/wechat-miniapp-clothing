<template>
  <view class="page">
    <scroll-view scroll-y class="category-nav">
      <view v-for="cat in categories" :key="cat.id"
        class="nav-item" :class="{ active: activeCat === cat.id }"
        @click="switchCategory(cat)">
        <text>{{ cat.name }}</text>
      </view>
    </scroll-view>
    <scroll-view scroll-y class="category-content">
      <view v-if="subCategories.length" class="sub-cats">
        <view v-for="sub in subCategories" :key="sub.id" class="sub-item" @click="selectSub(sub)">
          <image v-if="sub.icon" :src="sub.icon" class="sub-icon" />
          <text class="sub-name">{{ sub.name }}</text>
        </view>
      </view>
      <view class="product-section">
        <product-list :list="products" :loading="loading" :finished="true" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCategoryTree } from '@/api/category'
import { getProductList } from '@/api/product'
import ProductList from '@/components/product-list.vue'

const categories = ref([])
const activeCat = ref(null)
const products = ref([])
const loading = ref(false)

const subCategories = computed(() => {
  const cat = categories.value.find(c => c.id === activeCat.value)
  return cat?.children || []
})

onMounted(async () => {
  try {
    categories.value = await getCategoryTree()
    if (categories.value.length) {
      switchCategory(categories.value[0])
    }
  } catch {}
})

const switchCategory = async (cat) => {
  activeCat.value = cat.id
  await loadProducts(cat.id)
}

const selectSub = (sub) => {
  loadProducts(sub.id)
}

const loadProducts = async (categoryId) => {
  loading.value = true
  try {
    const res = await getProductList({ categoryId, page: 1, size: 20 })
    products.value = res.list || []
  } catch {}
  loading.value = false
}
</script>

<style lang="scss" scoped>
.page { display: flex; height: 100vh; background: $bg-page; }
.category-nav {
  width: 180rpx; background: $bg-card; height: 100%;
}
.nav-item {
  padding: $spacing-lg $spacing-sm;
  font-size: $font-sm; color: $text-secondary; text-align: center;
  position: relative;
  &.active {
    color: $brand-primary; font-weight: 600; background: $bg-page;
    &::before {
      content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
      width: 6rpx; height: 40rpx; background: $brand-primary; border-radius: 0 4rpx 4rpx 0;
    }
  }
}
.category-content { flex: 1; height: 100%; padding: $spacing-sm; }
.sub-cats {
  display: flex; flex-wrap: wrap; gap: $spacing-sm;
  background: $bg-card; border-radius: $radius-lg; padding: $spacing-md;
  margin-bottom: $spacing-md;
}
.sub-item {
  width: 30%; display: flex; flex-direction: column; align-items: center; gap: $spacing-xs;
}
.sub-icon { width: 80rpx; height: 80rpx; border-radius: $radius-md; }
.sub-name { font-size: $font-xs; color: $text-secondary; }
</style>
