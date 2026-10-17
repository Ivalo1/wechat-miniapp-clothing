import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategoryTree } from '@/api/category'

export const useAppStore = defineStore('app', () => {
  const systemInfo = ref({})
  const statusBarHeight = 0
  const categories = ref([])

  const initSystemInfo = () => {
    try {
      const info = uni.getSystemInfoSync()
      systemInfo.value = info
      return info
    } catch (e) {
      console.warn('getSystemInfo failed:', e)
    }
  }

  const fetchCategories = async () => {
    if (categories.value.length > 0) return categories.value
    try {
      categories.value = await getCategoryTree()
    } catch (e) {
      console.warn('fetchCategories failed:', e)
    }
    return categories.value
  }

  return { systemInfo, statusBarHeight, categories, initSystemInfo, fetchCategories }
})
