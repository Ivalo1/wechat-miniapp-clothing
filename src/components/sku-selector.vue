<template>
  <view class="sku-selector">
    <view class="sku-section" v-if="colors.length">
      <text class="sku-label">颜色</text>
      <view class="sku-options">
        <view v-for="c in colors" :key="c" class="sku-option color-option"
          :class="{ active: selectedColor === c }" @click="selectColor(c)">
          <image v-if="getColorImage(c)" :src="getColorImage(c)" class="color-image" />
          <text>{{ c }}</text>
        </view>
      </view>
    </view>
    <view class="sku-section" v-if="sizes.length">
      <text class="sku-label">尺码</text>
      <view class="sku-options">
        <view v-for="s in sizes" :key="s" class="sku-option"
          :class="{ active: selectedSize === s, disabled: isSizeDisabled(s) }"
          @click="selectSize(s)">
          <text>{{ s }}</text>
        </view>
      </view>
    </view>
    <view class="sku-info" v-if="currentSku">
      <text class="sku-stock">库存: {{ currentSku.stock }}</text>
      <view class="sku-quantity">
        <counter :modelValue="quantity" :max="currentSku.stock" @update:modelValue="q => quantity = q" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Counter from './counter.vue'

const props = defineProps({
  skus: { type: Array, default: () => [] }
})
const emit = defineEmits(['select'])

const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)

const colors = computed(() => [...new Set(props.skus.map(s => s.color).filter(Boolean))])
const sizes = computed(() => [...new Set(props.skus.map(s => s.size).filter(Boolean))])

const currentSku = computed(() => {
  if (!selectedColor.value && !selectedSize.value) return null
  return props.skus.find(s =>
    (!selectedColor.value || s.color === selectedColor.value) &&
    (!selectedSize.value || s.size === selectedSize.value)
  ) || null
})

const getColorImage = (color) => {
  const sku = props.skus.find(s => s.color === color && s.image)
  return sku ? sku.image : ''
}

const isSizeDisabled = (size) => {
  if (!selectedColor.value) return false
  const sku = props.skus.find(s => s.color === selectedColor.value && s.size === size)
  return !sku || sku.stock <= 0
}

const selectColor = (c) => {
  selectedColor.value = c
  quantity.value = 1
  emitSelection()
}

const selectSize = (s) => {
  if (isSizeDisabled(s)) return
  selectedSize.value = s
  quantity.value = 1
  emitSelection()
}

const emitSelection = () => {
  if (currentSku.value) {
    emit('select', { sku: currentSku.value, quantity: quantity.value })
  }
}

watch(() => quantity.value, emitSelection)
</script>

<style lang="scss" scoped>
.sku-section { margin-bottom: $spacing-md; }
.sku-label { font-size: $font-md; color: $text-primary; font-weight: 500; margin-bottom: $spacing-sm; display: block; }
.sku-options { display: flex; flex-wrap: wrap; gap: $spacing-sm; }
.sku-option {
  padding: $spacing-xs $spacing-md;
  border: 2rpx solid $border-color;
  border-radius: $radius-md;
  font-size: $font-sm;
  color: $text-primary;
  &.active { border-color: $brand-primary; color: $brand-primary; background: rgba($brand-primary, 0.05); }
  &.disabled { opacity: 0.3; text-decoration: line-through; }
}
.color-option { display: flex; align-items: center; gap: $spacing-xs; }
.color-image { width: 40rpx; height: 40rpx; border-radius: $radius-sm; }
.sku-info {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: $spacing-md; padding-top: $spacing-md; border-top: 1rpx solid $border-color;
}
.sku-stock { font-size: $font-sm; color: $text-secondary; }
</style>
