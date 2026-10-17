<template>
  <view class="page">
    <scroll-view scroll-y class="scroll-area">
      <swiper class="product-swiper" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#fff">
        <swiper-item v-for="(img, idx) in product.images" :key="idx">
          <image :src="img" class="swiper-image" mode="aspectFill" @click="previewImage(idx)" />
        </swiper-item>
      </swiper>

      <view class="product-info card">
        <view class="price-row">
          <price-comp :price="currentPrice" size="lg" />
          <text class="sales-text">已售 {{ formatSales(product.sales) }}</text>
        </view>
        <text class="product-name">{{ product.name }}</text>
        <view class="tag-list" v-if="product.tags">
          <text v-for="tag in product.tags" :key="tag" class="tag tag-brand">{{ tag }}</text>
        </view>
      </view>

      <view class="sku-section card" @click="showSkuPopup">
        <text class="section-label">选择规格</text>
        <text class="selected-text">{{ selectedSkuText || '请选择颜色/尺码' }}</text>
        <text class="arrow">›</text>
      </view>

      <view class="review-section card">
        <view class="section-header">
          <text class="section-title">商品评价</text>
          <text class="section-more" @click="goReviews">查看全部 ›</text>
        </view>
        <view v-if="reviews.length">
          <review-item v-for="r in reviews" :key="r.id" :review="r" />
        </view>
        <empty-state v-else text="暂无评价" icon="💬" />
      </view>

      <view class="recommend-section card" v-if="recommendList.length">
        <text class="section-title">相关推荐</text>
        <view class="recommend-grid">
          <product-card v-for="p in recommendList" :key="p.id" :product="p" style="width:48%" />
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar safe-bottom">
      <view class="bar-icon" @click="toggleFavorite">
        <text>{{ isFavorited ? '❤️' : '🤍' }}</text>
        <text class="icon-text">收藏</text>
      </view>
      <view class="bar-icon" @click="goCart">
        <text>🛒</text>
        <text class="icon-text">购物车</text>
      </view>
      <view class="bar-btn btn-add-cart" @click="onAddCart">加入购物车</view>
      <view class="bar-btn btn-buy-now" @click="onBuyNow">立即购买</view>
    </view>

    <view class="sku-mask" v-if="showSku" @click="showSku = false">
      <view class="sku-popup" @click.stop>
        <view class="popup-header">
          <image :src="selectedSku?.image || product.mainImage" class="popup-image" />
          <view class="popup-price">
            <price-comp :price="selectedSku?.price || product.price" size="lg" />
          </view>
          <text class="popup-close" @click="showSku = false">✕</text>
        </view>
        <sku-selector :skus="product.skus" @select="onSkuSelect" />
        <button class="btn-confirm" @click="confirmSku">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProductDetail } from '@/api/product'
import { getProductReviews } from '@/api/review'
import { addFavorite, removeFavorite } from '@/api/favorite'
import { guessYouLike, recordBehavior } from '@/api/recommend'
import { useCart } from '@/composables/useCart'
import { useAuth } from '@/composables/useAuth'
import PriceComp from '@/components/price.vue'
import ReviewItem from '@/components/review-item.vue'
import ProductCard from '@/components/product-card.vue'
import SkuSelector from '@/components/sku-selector.vue'
import EmptyState from '@/components/empty-state.vue'
import { formatSales } from '@/utils/format'

const product = ref({ images: [], skus: [], tags: [] })
const reviews = ref([])
const recommendList = ref([])
const selectedSku = ref(null)
const quantity = ref(1)
const showSku = ref(false)
const isFavorited = ref(false)
const skuAction = ref('')
let productId = null

const currentPrice = computed(() => selectedSku.value?.price || product.value.price)
const selectedSkuText = computed(() => {
  if (!selectedSku.value) return ''
  return `${selectedSku.value.color || ''} ${selectedSku.value.size || ''} × ${quantity.value}`
})

onLoad((options) => {
  productId = options.id
  loadProduct()
  loadReviews()
  loadRecommend()
  recordBehavior(productId, 'view').catch(() => {})
})

const loadProduct = async () => {
  try {
    product.value = await getProductDetail(productId)
  } catch {}
}

const loadReviews = async () => {
  try {
    const res = await getProductReviews(productId, 1, 3)
    reviews.value = Array.isArray(res) ? res : (res.list || [])
  } catch {}
}

const loadRecommend = async () => {
  try {
    const list = await guessYouLike(6)
    recommendList.value = (list || []).filter(p => p.id != productId)
  } catch {}
}

const previewImage = (idx) => {
  uni.previewImage({ urls: product.value.images, current: idx })
}

const showSkuPopup = () => { showSku.value = true; skuAction.value = '' }
const onSkuSelect = ({ sku, quantity: q }) => { selectedSku.value = sku; quantity.value = q }

const confirmSku = () => {
  if (!selectedSku.value) { uni.showToast({ title: '请选择规格', icon: 'none' }); return }
  showSku.value = false
  if (skuAction.value === 'addCart') doAddCart()
  else if (skuAction.value === 'buyNow') doBuyNow()
}

const { addToCart } = useCart()
const { checkLogin } = useAuth()

const onAddCart = () => {
  if (!checkLogin()) return
  if (!selectedSku.value) { skuAction.value = 'addCart'; showSku.value = true; return }
  doAddCart()
}

const doAddCart = async () => {
  await addToCart(selectedSku.value.id, quantity.value)
  recordBehavior(productId, 'cart').catch(() => {})
}

const onBuyNow = () => {
  if (!checkLogin()) return
  if (!selectedSku.value) { skuAction.value = 'buyNow'; showSku.value = true; return }
  doBuyNow()
}

const doBuyNow = () => {
  const items = JSON.stringify([{ skuId: selectedSku.value.id, quantity: quantity.value }])
  uni.navigateTo({ url: `/pages/order/create?directBuyItems=${encodeURIComponent(items)}` })
  recordBehavior(productId, 'purchase').catch(() => {})
}

const toggleFavorite = async () => {
  if (!checkLogin()) return
  try {
    if (isFavorited.value) { await removeFavorite(productId); isFavorited.value = false }
    else { await addFavorite(productId); isFavorited.value = true }
  } catch {}
}

const goCart = () => { uni.switchTab({ url: '/pages/cart/index' }) }
const goReviews = () => {}
</script>

<style lang="scss" scoped>
.page { height: 100vh; display: flex; flex-direction: column; background: $bg-page; }
.scroll-area { flex: 1; }
.product-swiper { width: 100%; height: 600rpx; }
.swiper-image { width: 100%; height: 100%; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin: $spacing-sm $spacing-md; box-shadow: $shadow-sm; }
.price-row { display: flex; justify-content: space-between; align-items: baseline; }
.sales-text { font-size: $font-sm; color: $text-placeholder; }
.product-name { font-size: $font-lg; font-weight: 600; color: $text-primary; margin-top: $spacing-sm; line-height: 1.5; display: block; }
.tag-list { display: flex; gap: $spacing-xs; margin-top: $spacing-sm; }
.sku-section { display: flex; align-items: center; }
.section-label { font-size: $font-md; color: $text-primary; margin-right: $spacing-md; }
.selected-text { flex: 1; font-size: $font-sm; color: $text-secondary; }
.arrow { font-size: $font-xl; color: $text-placeholder; }
.section-header { display: flex; justify-content: space-between; margin-bottom: $spacing-sm; }
.section-title { font-size: $font-lg; font-weight: 600; color: $text-primary; margin-bottom: $spacing-sm; }
.section-more { font-size: $font-sm; color: $text-placeholder; }
.recommend-grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.bottom-bar {
  display: flex; align-items: center; background: $bg-card;
  padding: $spacing-xs $spacing-md; box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.06);
}
.bar-icon { display: flex; flex-direction: column; align-items: center; padding: 0 $spacing-sm;
  text { font-size: 40rpx; } }
.icon-text { font-size: $font-xs; color: $text-secondary; }
.bar-btn {
  flex: 1; text-align: center; padding: $spacing-sm 0;
  border-radius: $radius-round; font-size: $font-md; font-weight: 500; color: #fff; margin-left: $spacing-sm;
}
.btn-add-cart { background: $brand-accent; }
.btn-buy-now { background: $brand-primary; }
.sku-mask {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 999;
  display: flex; align-items: flex-end;
}
.sku-popup {
  width: 100%; background: $bg-card; border-radius: $radius-xl $radius-xl 0 0;
  padding: $spacing-md; max-height: 70vh; overflow-y: auto;
}
.popup-header { display: flex; gap: $spacing-md; margin-bottom: $spacing-lg; position: relative; }
.popup-image { width: 160rpx; height: 160rpx; border-radius: $radius-md; }
.popup-price { flex: 1; display: flex; align-items: flex-end; }
.popup-close { position: absolute; top: 0; right: 0; font-size: $font-xl; color: $text-placeholder; padding: $spacing-xs; }
.btn-confirm {
  background: $brand-primary; color: #fff; border: none;
  border-radius: $radius-round; padding: $spacing-sm 0;
  font-size: $font-lg; width: 100%; margin-top: $spacing-lg;
  &::after { border: none; }
}
</style>
