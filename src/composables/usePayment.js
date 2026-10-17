import { payOrder } from '@/api/order'

export function usePayment() {
  const pay = async (orderNo) => {
    try {
      const payParams = await payOrder(orderNo)
      return new Promise((resolve, reject) => {
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: payParams.timeStamp,
          nonceStr: payParams.nonceStr,
          package: payParams.package,
          signType: payParams.signType || 'MD5',
          paySign: payParams.paySign,
          success: () => {
            uni.showToast({ title: '支付成功', icon: 'success' })
            resolve({ success: true, orderNo })
          },
          fail: (err) => {
            if (err.errMsg && err.errMsg.includes('cancel')) {
              uni.showToast({ title: '已取消支付', icon: 'none' })
              resolve({ success: false, cancelled: true })
            } else {
              uni.showToast({ title: '支付失败', icon: 'none' })
              resolve({ success: false })
            }
          }
        })
      })
    } catch (e) {
      uni.showToast({ title: '发起支付失败', icon: 'none' })
      return { success: false }
    }
  }

  return { pay }
}
