import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { wxLogin } from '@/api/auth'
import { getMemberInfo } from '@/api/member'

export const useUserStore = defineStore('user', () => {
  const token = ref(storage.get('token') || '')
  const userInfo = ref(storage.get('userInfo') || {})

  const isLoggedIn = computed(() => !!token.value)
  const nickname = computed(() => userInfo.value.nickname || '未登录')
  const avatar = computed(() => userInfo.value.avatar || '')

  const login = async () => {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            const data = await wxLogin(loginRes.code)
            token.value = data.token
            userInfo.value = { nickname: data.nickname, avatar: data.avatar }
            storage.set('token', data.token)
            storage.set('userInfo', userInfo.value)
            resolve(data)
          } catch (e) {
            reject(e)
          }
        },
        fail: reject
      })
    })
  }

  const fetchUserInfo = async () => {
    try {
      const info = await getMemberInfo()
      userInfo.value = { ...userInfo.value, ...info }
      storage.set('userInfo', userInfo.value)
    } catch (e) {
      console.warn('fetchUserInfo failed:', e)
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = {}
    storage.remove('token')
    storage.remove('userInfo')
  }

  return { token, userInfo, isLoggedIn, nickname, avatar, login, fetchUserInfo, logout }
})
