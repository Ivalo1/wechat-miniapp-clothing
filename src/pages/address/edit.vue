<template>
  <view class="page">
    <view class="form card">
      <view class="form-item">
        <text class="form-label">收货人</text>
        <input class="form-input" v-model="form.receiverName" placeholder="请输入收货人姓名" />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="form.receiverPhone" placeholder="请输入手机号" type="number" maxlength="11" />
      </view>
      <view class="form-item" @click="chooseRegion">
        <text class="form-label">所在地区</text>
        <text class="form-input" :class="{ placeholder: !form.province }">{{ regionText || '请选择省/市/区' }}</text>
        <text class="arrow">›</text>
      </view>
      <view class="form-item">
        <text class="form-label">详细地址</text>
        <input class="form-input" v-model="form.detailAddress" placeholder="请输入详细地址" />
      </view>
      <view class="form-item switch-item">
        <text class="form-label">设为默认</text>
        <switch :checked="form.isDefault === 1" @change="form.isDefault = $event.detail.value ? 1 : 0" color="#C4594A" />
      </view>
    </view>
    <view class="submit-section safe-bottom">
      <button class="btn-save" :disabled="saving" @click="onSave">{{ saving ? '保存中...' : '保存' }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addAddress, updateAddress } from '@/api/address'
import { isPhone } from '@/utils/validate'

const form = reactive({ receiverName: '', receiverPhone: '', province: '', city: '', district: '', detailAddress: '', isDefault: 0 })
const saving = ref(false)
let editId = null

const regionText = computed(() => {
  if (!form.province) return ''
  return `${form.province} ${form.city} ${form.district}`
})

onLoad((options) => {
  if (options.id) editId = options.id
})

const chooseRegion = () => {
  uni.chooseLocation({
    success: (res) => {
      form.province = res.province || ''
      form.city = res.city || ''
      form.district = res.district || ''
      form.detailAddress = res.address || form.detailAddress
    },
    fail: () => {
      const region = ['北京市', '上海市', '广州市', '深圳市', '杭州市']
      uni.showActionSheet({
        itemList: region,
        success: (res) => {
          form.province = region[res.tapIndex]
          form.city = region[res.tapIndex]
          form.district = '默认区'
        }
      })
    }
  })
}

const onSave = async () => {
  if (!form.receiverName) { uni.showToast({ title: '请输入收货人', icon: 'none' }); return }
  if (!isPhone(form.receiverPhone)) { uni.showToast({ title: '请输入正确手机号', icon: 'none' }); return }
  if (!form.province) { uni.showToast({ title: '请选择地区', icon: 'none' }); return }
  if (!form.detailAddress) { uni.showToast({ title: '请输入详细地址', icon: 'none' }); return }
  saving.value = true
  try {
    if (editId) await updateAddress(editId, form)
    else await addAddress(form)
    uni.showToast({ title: '保存成功' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch {}
  saving.value = false
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; padding-bottom: 120rpx; }
.card { background: $bg-card; border-radius: $radius-lg; padding: $spacing-md; box-shadow: $shadow-sm; }
.form-item { display: flex; align-items: center; padding: $spacing-md 0; border-bottom: 1rpx solid $border-color; &:last-child { border-bottom: none; } }
.form-label { width: 160rpx; font-size: $font-md; color: $text-primary; flex-shrink: 0; }
.form-input { flex: 1; font-size: $font-md; color: $text-primary; &.placeholder { color: $text-placeholder; } }
.arrow { color: $text-placeholder; font-size: $font-lg; }
.switch-item { justify-content: space-between; }
.submit-section { position: fixed; bottom: 0; left: 0; right: 0; padding: $spacing-md; background: $bg-card; }
.btn-save { background: $brand-primary; color: #fff; border: none; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
</style>
