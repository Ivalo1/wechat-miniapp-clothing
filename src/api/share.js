import { post } from './request'
export const generateShareCode = (productId) => post(`/mini/share/generate?productId=${productId}`)
export const recordClick = (shareCode) => post(`/mini/share/click?shareCode=${shareCode}`)
