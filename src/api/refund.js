import { get, post } from './request'
export const applyRefund = (data) => post('/mini/refund/apply', data)
export const getRefundList = (status) => get('/mini/refund/list', { status })
export const cancelRefund = (refundId) => post(`/mini/refund/cancel/${refundId}`)
