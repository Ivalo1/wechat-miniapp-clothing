<template>
  <view class="page">
    <view class="card">
      <text class="section-title">售后类型</text>
      <view class="type-options">
        <view v-for="t in types" :key="t.value" class="type-option" :class="{ active: form.type === t.value }" @click="form.type = t.value">
          <text>{{ t.label }}</text>
        </view>
      </view>
    </view>
    <view class="card">
      <text class="section-title">退款原因</text>
      <picker :range="reasons" @change="onReasonChange">
        <view class="picker-value">{{ form.reason || '请选择原因' }}</view>
      </picker>
    </view>
    <view class="card">
      <text class="section-title">补充描述</text>
      <textarea class="desc-input" v-model="form.description" placeholder="请详细描述问题" maxlength="200" />
      <view class="image-upload">
        <view v-for="(img, idx) in images" :key="idx" class="upload-preview">
          <image :src="img" mode="aspectFill" />
          <text class="remove-btn" @click="images.splice(idx, 1)">✕</text>
        </view>
        <view class="upload-btn" v-if="images.length < 3" @click="chooseImage">
          <text class="upload-icon">+</text>
          <text class="upload-text">上传</text>
        </view>
      </view>
    </view>
    <view class="submit-section safe-bottom">
      <button class="btn-primary" :disabled="submitting" @click="submit">{{ submitting ? '提交中...' : '提交申请' }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { applyRefund } from '@/api/refund'
import { uploadFile } from '@/api/file'

const types = [{ label: '仅退款', value: 1 }, { label: '退货退款', value: 2 }, { label: '换货', value: 3 }]
const reasons = ['不想要了', '质量问题', '尺码不符', '颜色不符', '收到破损', '其他']
const form = reactive({ orderItemId: null, type: 1, reason: '', description: '' })
const images = ref([])
const submitting = ref(false)

onLoad((options) => {
  if (options.orderItemId) form.orderItemId = options.orderItemId
})

const onReasonChange = (e) => { form.reason = reasons[e.detail.value] }

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
  if (!form.orderItemId) { uni.showToast({ title: '缺少订单项', icon: 'none' }); return }
  if (!form.reason) { uni.showToast({ title: '请选择原因', icon: 'none' }); return }
  submitting.value = true
  try {
    await applyRefund({ ...form, images: images.value.join(',') })
    uni.showToast({ title: '提交成功' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch {}
  submitting.value = false
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; padding-bottom: 120rpx; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.section-title { font-size: $font-md; font-weight: 500; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.type-options { display: flex; gap: $spacing-sm; }
.type-option { padding: $spacing-xs $spacing-lg; border: 2rpx solid $border-color; border-radius: $radius-md; font-size: $font-sm;
  &.active { border-color: $brand-primary; color: $brand-primary; background: rgba($brand-primary, 0.05); } }
.picker-value { font-size: $font-md; color: $text-secondary; padding: $spacing-sm 0; }
.desc-input { width: 100%; height: 200rpx; font-size: $font-sm; padding: $spacing-sm; background: $bg-page; border-radius: $radius-md; box-sizing: border-box; }
.image-upload { display: flex; gap: $spacing-sm; margin-top: $spacing-md; flex-wrap: wrap; }
.upload-preview { width: 160rpx; height: 160rpx; position: relative;
  image { width: 100%; height: 100%; border-radius: $radius-md; } }
.remove-btn { position: absolute; top: -10rpx; right: -10rpx; width: 36rpx; height: 36rpx; background: rgba(0,0,0,0.5); color: #fff; border-radius: 50%; font-size: $font-xs; text-align: center; line-height: 36rpx; }
.upload-btn { width: 160rpx; height: 160rpx; border: 2rpx dashed $border-color; border-radius: $radius-md; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.upload-icon { font-size: 48rpx; color: $text-placeholder; }
.upload-text { font-size: $font-xs; color: $text-placeholder; }
.submit-section { position: fixed; bottom: 0; left: 0; right: 0; padding: $spacing-md; background: $bg-card; }
.btn-primary { background: $brand-primary; color: #fff; border: none; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
</style>
