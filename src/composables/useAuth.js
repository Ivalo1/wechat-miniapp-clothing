import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export function useAuth() {
  const showLoginPopup = ref(false)

  const checkLogin = () => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      showLoginPopup.value = true
      return false
    }
    return true
  }

  const requireLogin = async (callback) => {
    if (!checkLogin()) return
    await callback()
  }

  const onLoginSuccess = () => {
    showLoginPopup.value = false
  }

  return { showLoginPopup, checkLogin, requireLogin, onLoginSuccess }
}
