import { get, post } from './request'
export const getCouponList = () => get('/mini/coupon/list')
export const receiveCoupon = (templateId) => post(`/mini/coupon/receive/${templateId}`)
