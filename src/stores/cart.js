import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCartList, addToCart, updateCart, removeFromCart } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const selectedIds = ref(new Set())

  const totalCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const selectedItems = computed(() =>
    items.value.filter(i => selectedIds.value.has(i.id))
  )

  const totalPrice = computed(() =>
    selectedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const isAllSelected = computed(() =>
    items.value.length > 0 && items.value.every(i => selectedIds.value.has(i.id))
  )

  const fetchCart = async () => {
    try {
      const list = await getCartList()
      items.value = list
      selectedIds.value = new Set(list.filter(i => i.selected === 1).map(i => i.id))
    } catch (e) {
      console.warn('fetchCart failed:', e)
    }
  }

  const addItem = async (skuId, quantity = 1) => {
    await addToCart({ skuId, quantity })
    await fetchCart()
  }

  const updateQuantity = async (id, quantity) => {
    await updateCart({ id, quantity })
    const item = items.value.find(i => i.id === id)
    if (item) item.quantity = quantity
  }

  const removeItem = async (id) => {
    await removeFromCart(id)
    items.value = items.value.filter(i => i.id !== id)
    selectedIds.value.delete(id)
  }

  const toggleSelect = (id) => {
    const s = new Set(selectedIds.value)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    selectedIds.value = s
  }

  const toggleAll = () => {
    if (isAllSelected.value) {
      selectedIds.value = new Set()
    } else {
      selectedIds.value = new Set(items.value.map(i => i.id))
    }
  }

  return { items, selectedIds, totalCount, selectedItems, totalPrice, isAllSelected, fetchCart, addItem, updateQuantity, removeItem, toggleSelect, toggleAll }
})
