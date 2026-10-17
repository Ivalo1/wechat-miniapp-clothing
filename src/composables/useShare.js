import { generateShareCode } from '@/api/share'

export function useShare() {
  const shareProduct = async (productId, title, imageUrl) => {
    try {
      const shareCode = await generateShareCode(productId)
      return {
        title: title || '为你推荐好物',
        path: `/pages/product/detail?id=${productId}&shareCode=${shareCode}`,
        imageUrl: imageUrl || ''
      }
    } catch (e) {
      return {
        title: title || '为你推荐好物',
        path: `/pages/product/detail?id=${productId}`,
        imageUrl: imageUrl || ''
      }
    }
  }

  return { shareProduct }
}
