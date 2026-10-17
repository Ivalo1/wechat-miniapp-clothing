export const isPhone = (phone) => /^1[3-9]\d{9}$/.test(phone)
export const isNotEmpty = (val) => val !== null && val !== undefined && val !== ''
export const isLength = (val, min, max) => {
  if (!val) return false
  const len = val.length
  return len >= min && (max === undefined || len <= max)
}
