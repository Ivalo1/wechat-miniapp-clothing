<template>
  <view class="page">
    <view v-for="addr in addresses" :key="addr.id">
      <address-card :address="addr" @select="onSelect(addr)" @edit="onEdit(addr)" @delete="onDelete(addr)" />
    </view>
    <empty-state v-if="!addresses.length" text="暂无收货地址" icon="📍" />
    <view class="add-bar safe-bottom">
      <button class="btn-add" @click="goAdd">+ 新增地址</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getAddressList, deleteAddress } from '@/api/address'
import AddressCard from '@/components/address-card.vue'
import EmptyState from '@/components/empty-state.vue'

const addresses = ref([])
let isSelectMode = false

onLoad((options) => { isSelectMode = options.mode === 'select' })
onShow(() => { loadAddresses() })

const loadAddresses = async () => { try { addresses.value = await getAddressList() } catch {} }

const onSelect = (addr) => {
  if (!isSelectMode) return
  const eventChannel = getOpenerEventChannel()
  if (eventChannel) eventChannel.emit('selectAddress', addr)
  uni.navigateBack()
}

const onEdit = (addr) => { uni.navigateTo({ url: `/pages/address/edit?id=${addr.id}` }) }
const onDelete = (addr) => {
  uni.showModal({ title: '提示', content: '确定删除该地址？', success: async (res) => {
    if (res.confirm) { await deleteAddress(addr.id); uni.showToast({ title: '已删除' }); loadAddresses() }
  }})
}
const goAdd = () => { uni.navigateTo({ url: '/pages/address/edit' }) }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: $bg-page; padding: $spacing-md; padding-bottom: 120rpx; }
.add-bar { position: fixed; bottom: 0; left: 0; right: 0; padding: $spacing-md; background: $bg-card; }
.btn-add { background: $brand-primary; color: #fff; border: none; border-radius: $radius-round; padding: $spacing-sm 0; font-size: $font-md; &::after { border: none; } }
</style>
