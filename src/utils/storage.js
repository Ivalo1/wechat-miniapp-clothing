const PREFIX = 'clothing_'

export const storage = {
  get(key) {
    try {
      const val = uni.getStorageSync(PREFIX + key)
      return val ? JSON.parse(val) : null
    } catch { return null }
  },
  set(key, value) {
    try { uni.setStorageSync(PREFIX + key, JSON.stringify(value)) } catch {}
  },
  remove(key) {
    try { uni.removeStorageSync(PREFIX + key) } catch {}
  },
  clear() {
    try { uni.clearStorageSync() } catch {}
  }
}
