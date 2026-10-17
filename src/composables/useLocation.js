export function useLocation() {
  const chooseAddress = () => {
    return new Promise((resolve) => {
      uni.navigateTo({
        url: '/pages/address/list?mode=select',
        events: {
          selectAddress(address) {
            resolve(address)
          }
        }
      })
    })
  }

  const chooseRegion = () => {
    return new Promise((resolve) => {
      uni.chooseLocation({
        success: (res) => resolve(res),
        fail: () => resolve(null)
      })
    })
  }

  return { chooseAddress, chooseRegion }
}
