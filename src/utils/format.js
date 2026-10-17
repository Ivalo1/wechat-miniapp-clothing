/** 格式化价格: 128.00 → "128.00" */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '0.00'
  return Number(price).toFixed(2)
}

/** 格式化价格整数部分 */
export const formatPriceInt = (price) => {
  return Math.floor(Number(price) || 0)
}

/** 格式化价格小数部分 */
export const formatPriceDec = (price) => {
  const dec = (Number(price) || 0).toFixed(2).split('.')[1]
  return dec || '00'
}

/** 格式化销量: 1234 → "1234" */
export const formatSales = (sales) => {
  if (!sales) return '0'
  if (sales >= 10000) return (sales / 10000).toFixed(1) + 'w'
  if (sales >= 1000) return (sales / 1000).toFixed(1) + 'k'
  return String(sales)
}

/** 格式化时间 */
export const formatTime = (time) => {
  if (!time) return ''
  const d = new Date(time)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 格式化日期 */
export const formatDate = (time) => {
  if (!time) return ''
  const d = new Date(time)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

/** 手机号脱敏 */
export const maskPhone = (phone) => {
  if (!phone || phone.length < 7) return phone
  return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4)
}
