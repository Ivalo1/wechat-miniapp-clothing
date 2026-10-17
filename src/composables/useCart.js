import { useCartStore } from '@/stores/cart'

export function useCart() {
  const cartStore = useCartStore()

  const addToCart = async (skuId, quantity = 1) => {
    try {
      await cartStore.addItem(skuId, quantity)
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    } catch (e) {
      uni.showToast({ title: '加入失败', icon: 'none' })
    }
  }

  const getCartBadge = () => cartStore.totalCount

  return { addToCart, getCartBadge }
}
