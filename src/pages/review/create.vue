<template>
  <view class="page">
    <view class="card">
      <text class="section-title">商品评分</text>
      <view class="rating">
        <text v-for="i in 5" :key="i" class="star" :class="{ active: i <= rating }" @click="rating = i">★</text>
      </view>
    </view>
    <view class="card">
      <text class="section-title">评价内容</text>
      <textarea class="content-input" v-model="content" placeholder="分享你的使用感受" maxlength="500" />
    </view>
    <view class="card">
      <text class="section-title">上传图片</text>
      <view class="image-upload">
        <view v-for="(img, idx) in images" :key="idx" class="upload-preview">
          <image :src="img" mode="aspectFill" />
          <text class="remove-btn" @click="images.splice(idx, 1)">✕</text>
        </view>
        <view class="upload-btn" v-if="images.length < 3" @click="chooseImage">
          <text class="upload-icon">+</text>
        </view>
      </view>
    </view>
    <view class="submit-section safe-bottom">
      <button class="btn-primary" :disabled="submitting" @click="submit">提交评价</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createReview } from '@/api/review'
import { uploadFile } from '@/api/file'

const productId = ref(null)
const orderId = ref('')
const orderItemId = ref(null)
const rating = ref(5)
const content = ref('')
const images = ref([])
const submitting = ref(false)

onLoad((options) => {
  productId.value = options.productId
  orderId.value = options.orderId || ''
  orderItemId.value = options.orderItemId
})

const chooseImage = () => {
  uni.chooseImage({
    count: 3 - images.value.length, sizeType: ['compressed'],
    success: async (res) => {
      for (const path of res.tempFilePaths) {
        try { const url = await uploadFile(path); images.value.push(url) } catch {}
      }
    }
  })
}

const submit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await createReview(productId.value, orderId.value, {
      orderItemId: orderItemId.value, rating: rating.value,
      content: content.value, images: images.value.join(',')
    })
    uni.showToast({ title: '评价成功' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch {}
  submitting.value = false
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; padding-bottom: 120rpx; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-md; }
.section-title { font-size: $font-md; font-weight: 500; display: block; margin-bottom: $spacing-sm; }
.rating { display: flex; gap: $spacing-md; }
.star { font-size: 60rpx; color: $border-color; &.active { color: #FFB800; } }
.content-input { width: 100%; height: 200rpx; font-size: $font-sm; padding: $spacing-sm; background: $bg-page; border-radius: $radius-md; box-sizing: border-box; }
.image-upload { display: flex; gap: $spacing-sm; flex-wrap: wrap; }
.upload-preview { width: 160rpx; height: 160rpx; position: relative; image { width: 100%; height: 100%; border-radius: $radius-md; } }
.remove-btn { position: absolute; top: -10rpx; right: -10rpx; width: 36rpx; height: 36rpx; background: rgba(0,0,0,0.5); color: #fff; border-radius: 50%; font-size: $font-xs; text-align: center; line-height: 36rpx; }
.upload-btn { width: 160rpx; height: 160rpx; border: 2rpx dashed $border-color; border-radius: $radius-md; display: flex; align-items: center; justify-content: center; }
.upload-icon { font-size: 60rpx; color: $text-placeholder; }
.submit-section { position: fixed; bottom: 0; left: 0; right: 0; padding: $spacing-md; background: $bg-card; }
.btn-primary { background: $brand-primary; color: #fff; border: none; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
</style>
