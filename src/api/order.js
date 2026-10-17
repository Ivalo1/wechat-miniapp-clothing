import { get, post } from './request'
export const createOrder = (data) => post('/mini/order/create', data)
export const getOrderList = (params) => get('/mini/order/list', params)
export const getOrderDetail = (orderNo) => get(`/mini/order/${orderNo}`)
export const cancelOrder = (orderNo) => post(`/mini/order/cancel/${orderNo}`)
export const confirmReceive = (orderNo) => post(`/mini/order/confirm/${orderNo}`)
export const payOrder = (orderNo) => post(`/mini/order/pay/${orderNo}`)
